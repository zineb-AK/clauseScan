<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContractRequest;
use App\Http\Resources\AnalysisResource;
use App\Http\Resources\ContractResource;
use App\Jobs\AnalyzeContractJob;
use App\Models\Analysis;
use App\Models\Contract;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Spatie\PdfToText\Pdf;

class ContractController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $contracts = $request->user()
            ->contracts()
            ->orderBy('created_at', 'desc')
            ->paginate();

        return ContractResource::collection($contracts)->response();
    }

    public function store(StoreContractRequest $request): JsonResponse
    {
        if ($request->has('content')) {
            return $this->storeFromText($request);
        }

        return $this->storeFromPdf($request);
    }

    private function storeFromText(StoreContractRequest $request): JsonResponse
    {
        $content = $request->input('content');
        $title = $this->deriveTitle($content);

        $contract = Contract::create([
            'user_id' => $request->user()->id,
            'title' => $title,
            'source_type' => 'text',
            'file_path' => null,
            'raw_text' => $content,
            'status' => 'pending',
        ]);

        return (new ContractResource($contract))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    private function storeFromPdf(StoreContractRequest $request): JsonResponse
    {
        $file = $request->file('contract');
        $filePath = $file->store('contracts');
        $fullPath = str_replace('/', DIRECTORY_SEPARATOR, Storage::disk('local')->path($filePath));

        try {
            $binaryPath = config('pdf-to-text.binary');
            $text = $binaryPath
                ? Pdf::getText($fullPath, $binaryPath)
                : Pdf::getText($fullPath);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Impossible de lire le fichier PDF. Le fichier est peut-être corrompu.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

      $text = trim($text);
      $text = iconv('UTF-8', 'UTF-8//IGNORE', $text);
      
        if (empty($text)) {
            return response()->json([
                'message' => 'Le PDF semble être scanné (aucun texte exploitable). Veuillez fournir un PDF contenant du texte sélectionnable.',
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $contract = Contract::create([
            'user_id' => $request->user()->id,
            'title' => $file->getClientOriginalName(),
            'source_type' => 'pdf',
            'file_path' => $filePath,
            'raw_text' => $text,
            'status' => 'pending',
        ]);

        return (new ContractResource($contract))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function destroy(Contract $contract): JsonResponse
    {
        $this->authorize('delete', $contract);

        if ($contract->source_type === 'pdf' && $contract->file_path) {
            Storage::delete($contract->file_path);
        }

        $contract->delete();

        return response()->json(null, Response::HTTP_NO_CONTENT);
    }

    public function analyze(Contract $contract): JsonResponse
    {
        $this->authorize('analyze', $contract);

        $existing = $contract->analyses()
            ->whereIn('status', ['pending', 'processing'])
            ->exists();

        if ($existing) {
            return response()->json([
                'message' => 'Une analyse est déjà en cours pour ce contrat.',
            ], Response::HTTP_CONFLICT);
        }

        $analysis = Analysis::create([
            'contract_id' => $contract->id,
            'user_id' => $contract->user_id,
            'status' => 'pending',
        ]);

        AnalyzeContractJob::dispatch($analysis);

        return (new AnalysisResource($analysis))
            ->response()
            ->setStatusCode(Response::HTTP_ACCEPTED);
    }

    private function deriveTitle(string $content): string
    {
        $lines = explode("\n", $content);

        foreach ($lines as $line) {
            $trimmed = trim($line);
            if (! empty($trimmed)) {
                return mb_substr($trimmed, 0, 255);
            }
        }

        return 'Contrat sans titre';
    }
}
