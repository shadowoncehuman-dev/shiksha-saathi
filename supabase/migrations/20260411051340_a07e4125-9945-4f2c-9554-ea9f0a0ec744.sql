-- Delete the duplicate (keep earliest, remove roll_number 10007)
DELETE FROM registrations WHERE id = '87bf149b-1ea4-42ed-8837-fd03c667225d';

-- Now create the unique index
CREATE UNIQUE INDEX idx_unique_registration 
ON registrations (LOWER(TRIM(name)), LOWER(TRIM(father_name)), class);