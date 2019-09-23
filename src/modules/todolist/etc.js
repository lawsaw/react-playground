import React from "react";

const generateId = () => Math.random().toString(36).substring(2, 4) + Math.random().toString(36).substring(2, 4);

export default {
    generateId
};