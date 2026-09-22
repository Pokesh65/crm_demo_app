import { useState } from "react";
import { useNavigate } from "react-router-dom";

import RegisterForm from "./RegisterForm";
import {
    errorToaster,
    successToster,
} from "../../utils/customToaster";
import { USERS_KEY } from "../../utils/commonNames";
import { getStoredData, saveStoredData } from "../../utils/utilityFunction";
import { setIsLoading } from "../../store/slices/AuthSlice";
import { useDispatch } from "react-redux";





function RegisterPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // ── Validate individual field ─────────────────────────────
    const validateField = (name, value, currentFormData = formData) => {
        let error = "";

        if (name === "name") {
            if (!value.trim()) {
                error = "Full name is required";
            } else if (value.trim().length < 3) {
                error = "Name must be at least 3 characters";
            }
        }

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

        if (name === "confirmPassword") {
            if (!value.trim()) {
                error = "Please confirm your password";
            } else if (value !== currentFormData.password) {
                error = "Passwords do not match";
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

        if (!formData.name.trim()) {
            newErrors.name = "Full name is required";
        } else if (formData.name.trim().length < 3) {
            newErrors.name = "Name must be at least 3 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    // ── Handle input changes ──────────────────────────────────
    const handleOnChange = (e) => {
        const { name, value } = e.target;

        const nextFormData = { ...formData, [name]: value };
        setFormData(nextFormData);

        validateField(name, value, nextFormData);

        // Re-check confirmPassword whenever password itself changes,
        // so a stale "passwords do not match" error clears live.
        if (name === "password" && nextFormData.confirmPassword) {
            validateField("confirmPassword", nextFormData.confirmPassword, nextFormData);
        }
    };

    // ── Handle registration ────────────────────────────────────
    const handleSubmit = async (evt) => {
        evt.preventDefault();

        if (!validateAll()) {
            errorToaster(
                "Fill Required Fields",
                "Please fill all required fields correctly"
            );
            return;
        }

        // setLoading(true);
        dispatch(setIsLoading(true))


        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 600));

        try {
            const existingUsers = getStoredData(USERS_KEY);

            console.log("existingUsers", existingUsers)

            const emailTaken = existingUsers.some(
                (user) =>
                    user.email.toLowerCase() ===
                    formData.email.trim().toLowerCase()
            );

            console.log("emailTaken", emailTaken)

            if (emailTaken) {
                errorToaster(
                    "Registration Failed",
                    "An account with this email already exists"
                );
                setErrors({ email: "This email is already registered" });
                return;
            }

            const newUser = {
                id:
                    typeof crypto !== "undefined" && crypto.randomUUID
                        ? crypto.randomUUID()
                        : `user_${Date.now()}`,
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                // Note: storing plain-text passwords in localStorage is only
                // acceptable here because there is no backend — this mock
                // auth flow is for local/demo use only.
                password: formData.password,
                userRole: "employee",
                createdAt: new Date().toISOString(),
            };

            saveStoredData(USERS_KEY, [...existingUsers, newUser]);

            successToster(
                "Registration Successful",
                "Your account has been created. You can now sign in!"
            );

            setFormData({ name: "", email: "", password: "", confirmPassword: "" });
            setErrors({});

            // Redirect to login
            navigate("/login");
        } catch (error) {
            console.error(error);

            errorToaster(
                "Registration Failed",
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
            dispatch(setIsLoading(false))

        }
    };

    return (
        <RegisterForm
            formData={formData}
            handleOnChange={handleOnChange}
            showPass={showPass}
            setShowPass={setShowPass}
            showConfirmPass={showConfirmPass}
            setShowConfirmPass={setShowConfirmPass}
            loading={loading}
            errors={errors}
            handleSubmit={handleSubmit}
        />
    );
}

export default RegisterPage;