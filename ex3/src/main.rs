use std::io;
use std::io::Read;
use regex::Regex;

fn main() -> io::Result<()> {
    let mut buffer = String::new();

    io::stdin().read_to_string(&mut buffer)?;

    let re = Regex::new(r"mul\((\d+,\d+)\)").unwrap();
    let mul: Vec<(i32, i32)> = re.captures_iter(&buffer).map(|caps| {
        let mut iter = caps.get(1).unwrap().as_str().split(",");
        (iter.next().unwrap().parse::<i32>().unwrap(), iter.next().unwrap().parse::<i32>().unwrap())
    }).collect();
    let total: i32 = mul.iter().map(|(a, b)| { a * b }).sum();
    println!("{total}");
    Ok(())
}