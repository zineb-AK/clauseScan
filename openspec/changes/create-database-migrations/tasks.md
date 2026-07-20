## 1. Migration: Contracts

- [ ] 1.1 Create migration `create_contracts_table` with columns: id, user_id (FK→users), title (string), source_type (string: pdf|text), file_path (nullable string), raw_text (longText), status (string), timestamps

## 2. Migration: Analyses

- [ ] 2.1 Create migration `create_analyses_table` with columns: id, contract_id (FK→contracts), status (string: pending|processing|done|failed), language (string), result_json (json), timestamps

## 3. Migration: Clauses

- [ ] 3.1 Create migration `create_clauses_table` with columns: id, analysis_id (FK→analyses), type (string), content (text), risk_level (string: low|medium|high), explanation (text), timestamps

## 4. Finalize

- [ ] 4.1 Run `php artisan migrate --pretend` to verify SQL
- [ ] 4.2 Run `vendor/bin/pint --dirty --format agent`
