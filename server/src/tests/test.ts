import { exit } from "process";
import { testUserManagement } from "./DBfunctions.test.js";


//need to manually write in the data to connect to the database
try{
    await testUserManagement();
}
catch
{
    console.log("test failed");
    exit(1)
}

exit(0);