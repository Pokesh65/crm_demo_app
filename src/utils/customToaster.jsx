import { toast as sonnerToast } from "sonner";
import {
    FiCheckCircle,
    FiXCircle,
    FiAlertTriangle,
    FiInfo,
} from "react-icons/fi";

// SUCCESS
export const successToster = (
    message,
    description,
    duration = 4000,
    icon
) => {
    sonnerToast.success(message, {
        description,
        duration,
        icon: icon || <FiCheckCircle />,
    });
};

// ERROR
export const errorToaster = (
    message,
    description,
    duration = 4000,
    icon
) => {
    sonnerToast.error(message, {
        description,
        duration,
        icon: icon || <FiXCircle />,
    });
};

// WARNING
export const warningToster = (
    message,
    description,
    duration = 4000,
    icon
) => {
    sonnerToast.warning(message, {
        description,
        duration,
        icon: icon || <FiAlertTriangle />,
    });
};

// INFO
export const infoToster = (
    message,
    description,
    duration = 4000,
    icon
) => {
    sonnerToast(message, {
        description,
        duration,
        icon: icon || <FiInfo />,
        className: "bg-blue-500/10 border-blue-500/20",
    });
};