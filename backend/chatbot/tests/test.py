import time
import math

def perform_calculations():
    result = 0
    for i in range(1, 1000000):
        result += math.sqrt(i) ** 3
    return result

def main():
    start_time = time.time()
    total_calculations = 0

    for i in range(1, 1000000):
        total_calculations += perform_calculations()
        if i % 100000 == 0:
            print(f"Count: {i}, Intermediate Calculation Result: {total_calculations}, Elapsed Time: {time.time() - start_time:.2f} seconds")

    end_time = time.time()
    print(f"Final Count: {i}, Total Calculation Result: {total_calculations}, Total Elapsed Time: {end_time - start_time:.2f} seconds")

if __name__ == "__main__":
    main()
