WITH
  by_line AS (
    SELECT
      val,
      COUNT(CASE WHEN val IS NULL THEN 1 END) OVER (ORDER BY id) AS line
    FROM list),
  by_line_ AS (SELECT * FROM by_line WHERE val IS NOT NULL),
  by_num AS (SELECT *, row_number() OVER (PARTITION BY line ORDER BY line) num FROM by_line WHERE val IS NOT NULL),
  count_by_line AS (SELECT line, COUNT(*) num_vals FROM by_line_ GROUP BY line),
  line_exclude_combinations AS (SELECT line, value AS exclude, num_vals FROM count_by_line, generate_series(0, count_by_line.num_vals)),
  all_combinations AS (SELECT line, value AS num, exclude FROM line_exclude_combinations, generate_series(1, num_vals)),
  all_combinations_with_exlusions AS (SELECT * FROM all_combinations WHERE num <> exclude),
  all_combinations_with_exlusions_and_values AS (
    SELECT c.line, c.num, exclude, val, row_number() OVER (PARTITION BY line, exclude ORDER BY line, exclude, num) id FROM all_combinations_with_exlusions c NATURAL JOIN by_num)
  SELECT COUNT(*) FROM
    (SELECT max(safe) safe FROM
      (SELECT line, exclude, max(diff) BETWEEN 1 AND 3 AND max(sign) == min(sign) safe FROM 
        (SELECT
            l1.val l1,
            l2.val l2,
            abs(l2.val - l1.val) diff,
            sign(l2.val - l1.val) sign,
            l1.exclude,
            l1.id,
            l1.line
            FROM all_combinations_with_exlusions_and_values l1 INNER JOIN all_combinations_with_exlusions_and_values l2 ON l1.id + 1 = l2.id AND l1.exclude = l2.exclude AND l1.line = l2.line
            WHERE l2 IS NOT NULL)
        GROUP BY line, exclude)
      GROUP BY line)
    WHERE safe = 1;
  