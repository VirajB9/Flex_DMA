package com.viraj.dmabackend.auth.exception;

import com.viraj.dmabackend.auth.enmus.UserStatus;

public class InvalidUserStatusException extends RuntimeException {

    public InvalidUserStatusException(UserStatus status) {
        super("Status '" + status + "' is not allowed for this operation.");
    }
}