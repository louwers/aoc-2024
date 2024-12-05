use std::io;
use std::io::Read;
use regex::Regex;

fn main() -> io::Result<()> {
    let mut buffer = String::new();

    io::stdin().read_to_string(&mut buffer)?;

    let re = Regex::new(r"(mul\((\d+),(\d+)\))|(don't\(\))|(do\(\))").unwrap();

    let mut doMul = true;
    
    let mul: Vec<(i32, i32)> = re.captures_iter(&buffer).map(|caps| {
        let capt = caps.get(0).unwrap().as_str();

        if capt.starts_with("don't") {
            doMul = false;
            return (0, 0);
        }

        if capt.starts_with("do") {
            doMul = true;
            return (0, 0);
        }

        if doMul && capt.starts_with("mul") {
            let a = caps.get(2).unwrap().as_str().parse::<i32>().unwrap();
            let b = caps.get(3).unwrap().as_str().parse::<i32>().unwrap();
            return (a, b);
        }
        (0, 0)
    }).collect();
    let total: i32 = mul.iter().map(|(a, b)| { a * b }).sum();
    println!("{total}");
    Ok(())
}