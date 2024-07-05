# Define the number of times to run the script
$numRuns = 10
$scriptPath = "./test_facilitate.py"  # Replace with the actual path to your script

# Loop to start the script in detached mode n times
for ($i = 1; $i -le $numRuns; $i++) {
    Write-Host "Starting test $i of $numRuns"
    Start-Process -FilePath "python" -ArgumentList $scriptPath -NoNewWindow -PassThru
}

Write-Host "All tests started"
