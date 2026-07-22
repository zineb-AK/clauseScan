<?php

namespace App\Policies;

use App\Models\Contract;
use App\Models\User;

class ContractPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function view(User $user, Contract $contract): bool
    {
        return $user->id === $contract->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function delete(User $user, Contract $contract): bool
    {
        return $user->id === $contract->user_id;
    }

    public function analyze(User $user, Contract $contract): bool
    {
        return $user->id === $contract->user_id;
    }
}
