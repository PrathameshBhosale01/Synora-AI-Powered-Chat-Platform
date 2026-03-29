import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading state

    useEffect(() => {
        const verifySession = async () => {
            try {
                // We use your existing '/api/thread' endpoint as a check.
                // Since it uses 'fetchUser' middleware, it will fail if the cookie is invalid.
                const res = await fetch("http://localhost:5000/api/thread", {
                    method: "GET",
                    credentials: "include" // Send the cookie!
                });

                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                console.log("Auth Check Failed:", err);
                setIsAuthenticated(false);
            }
        };

        verifySession();
    }, []);

    //  While checking, show a loading screen (prevents flashing the login page)
    if (isAuthenticated === null) {
        return (
            <div style={{ 
                height: "100vh", 
                width: "100%", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                backgroundColor: "#09090b" // Matches your dark theme
            }}>
                <ScaleLoader color="#fff" height={35} />
            </div>
        );
    }

    // 2. If valid, render the children (The Chat Page)
    // 3. If invalid, redirect to Login
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;