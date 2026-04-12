INSERT INTO registrations (roll_number, name, father_name, class, "group", phone, village) 
SELECT * FROM (VALUES
('9022', 'Vishal', 'Brijpal', 9, 'Group 2', '9897335261', 'Ahmadpur Nayagaon'),
('9042', 'Pankaj', 'Raju', 9, 'Group 2', '7078862594', 'Ahmadpur Nayagaon'),
('9068', 'Khushi', 'Sansarpal', 9, 'Group 2', '0000000000', 'Ahmadpur Nayagaon')
) AS t(roll_number, name, father_name, class, "group", phone, village)
WHERE NOT EXISTS (
  SELECT 1 FROM registrations r 
  WHERE r.roll_number = t.roll_number
)
AND NOT EXISTS (
  SELECT 1 FROM registrations r 
  WHERE LOWER(TRIM(r.name)) = LOWER(TRIM(t.name)) 
  AND LOWER(TRIM(r.father_name)) = LOWER(TRIM(t.father_name)) 
  AND r.class = t.class::int
);

UPDATE roll_counters SET last_number = 70 WHERE class = 6;
UPDATE roll_counters SET last_number = 68 WHERE class = 9;