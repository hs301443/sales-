import dotenv from "dotenv";
dotenv.config();
export function dbconnection(){
    // Prisma manages connections on demand. Keep to avoid import breakage.
    if(!process.env.DATABASE_URL){
        console.log("DATABASE_URL not set for Prisma/MySQL");
    }
}

