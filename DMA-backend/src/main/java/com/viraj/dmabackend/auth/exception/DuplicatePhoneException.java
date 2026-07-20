package com.viraj.dmabackend.auth.exception;

public class DuplicatePhoneException extends RuntimeException {

    public DuplicatePhoneException(String phoneNumber) {
        super("Phone number already exists: " + phoneNumber);
    }
}
