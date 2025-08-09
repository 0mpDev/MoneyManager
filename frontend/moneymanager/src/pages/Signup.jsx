import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets"; // adjust path if needed

const Signup = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cerror, setError] = useState(null);

    const navigate = useNavigate();
    
    return (
        <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/* Background image with blur */}
            <img 
                src={assets.login_bg} 
                alt="Background" 
                className="absolute inset-0 w-full h-full object-cover blur-sm" 
            />
        </div>
    );
};

export default Signup;
