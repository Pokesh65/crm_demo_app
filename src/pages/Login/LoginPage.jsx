import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "./LoginForm";
import {
    errorToaster,
    successToster,
} from "../../utils/customToaster";
import { getStoredData, saveStoredData } from "../../utils/utilityFunction";
import { USERS_KEY } from "../../utils/commonNames";
import { useDispatch } from "react-redux";
import { setIsAuthenticated, setIsLoading } from "../../store/slices/AuthSlice";

// ── Mock credentials ──────────────────────────────────────────


// ── Generate fake token ───────────────────────────────────────
const generateMockToken = (email) =>
    `mock-token.${btoa(email)}.${Date.now()}`;

// console.log("Token by email", atob(generateMockToken("pokesh65@gmail.com").split(".")));

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [usersData, setUsersData] = useState([])
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});


    useEffect(() => {
        const USERS_DATA = [...getStoredData(USERS_KEY),
        {
            id:
                typeof crypto !== "undefined" && crypto.randomUUID
                    ? crypto.randomUUID()
                    : `user_${Date.now()}`,
            email: "admin@gmail.com",
            password: "admin123",
            name: "Admin User",
            userRole: "admin",
            createdAt: new Date().toISOString(),
        }
        ]
        console.log("USERS_DATA", USERS_DATA)

        setUsersData(USERS_DATA)
    }, [])

    // ── Validate individual field ─────────────────────────────
    const validateField = (name, value) => {
        let error = "";

        if (name === "email") {
            if (!value.trim()) {
                error = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                error = "Please enter a valid email";
            }
        }

        if (name === "password") {
            if (!value.trim()) {
                error = "Password is required";
            } else if (value.length < 6) {
                error = "Password must be at least 6 characters";
            }
        }

        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));

        return !error;
    };

    // ── Validate entire form ──────────────────────────────────
    const validateAll = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ── Handle input changes ──────────────────────────────────
    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        validateField(name, value);
    };

    // ── Handle login ──────────────────────────────────────────
    const handleSubmit = async (evt) => {
        evt.preventDefault();

        if (!validateAll()) {
            errorToaster(
                "Fill Required Fields",
                "Please fill all required fields"
            );
            return;
        }

        setLoading(true);
        // dispatch(setIsLoading(true))

        // Simulate network request
        await new Promise((resolve) =>
            setTimeout(resolve, 600)
        );

        try {
            const matchedUser = usersData.find(
                (user) =>
                    user.email.toLowerCase() ===
                    formData.email.trim().toLowerCase() &&
                    user.password === formData.password
            );

            // Invalid credentials
            if (!matchedUser) {
                errorToaster(
                    "Login Failed",
                    "Invalid email or password"
                );

                setErrors({
                    email: " ",
                    password: "Invalid email or password",
                });

                return;
            }

            // Generate fake access token
            const accessToken = generateMockToken(
                matchedUser.email
            );

            // Store user information
            const user = {
                name: matchedUser.name,
                email: matchedUser.email,
                userRole: matchedUser.userRole,
            };

            // Persist session
            saveStoredData("userDetails", JSON.stringify(user))
            saveStoredData("accessToken", accessToken)
            dispatch(setIsAuthenticated(true))

            // Success
            successToster(
                "Login Successful",
                "You have been logged in successfully!"
            );

            setErrors({});

            // Redirect to dashboard
            navigate("/dashboard");
        } catch (error) {
            console.error(error);

            errorToaster(
                "Login Failed",
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
            // dispatch(setIsLoading(false))

        }
    };

    return (
        <LoginForm
            formData={formData}
            handleOnChange={handleOnChange}
            showPass={showPass}
            setShowPass={setShowPass}
            loading={loading}
            errors={errors}
            handleSubmit={handleSubmit}
        />
    );
}

export default LoginPage;