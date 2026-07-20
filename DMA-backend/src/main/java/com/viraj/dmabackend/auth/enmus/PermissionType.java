package com.viraj.dmabackend.auth.enmus;

public enum PermissionType {

    // ===========================
    // USER MANAGEMENT
    // ===========================
    USER_CREATE,
    USER_READ,
    USER_UPDATE,
    USER_DELETE,

    // ===========================
    // CLIENT MANAGEMENT
    // ===========================
    CLIENT_CREATE,
    CLIENT_READ,
    CLIENT_UPDATE,
    CLIENT_DELETE,

    // ===========================
    // LEAD MANAGEMENT
    // ===========================
    LEAD_CREATE,
    LEAD_READ,
    LEAD_UPDATE,
    LEAD_DELETE,

    // ===========================
    // PROJECT MANAGEMENT
    // ===========================
    PROJECT_CREATE,
    PROJECT_READ,
    PROJECT_UPDATE,
    PROJECT_DELETE,

    // ===========================
    // INVOICE MANAGEMENT
    // ===========================
    INVOICE_CREATE,
    INVOICE_READ,
    INVOICE_UPDATE,
    INVOICE_DELETE
}