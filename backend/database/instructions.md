Run this command to create the database and tables in the database container:

docker exec -it database /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P "<<Password goes here>>" -i app/dbscript.sql
