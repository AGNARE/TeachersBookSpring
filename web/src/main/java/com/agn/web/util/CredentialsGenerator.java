package com.agn.web.util;

import java.util.Random;

public class CredentialsGenerator {

    private static final Random RANDOM = new Random();

    /**
     * Generates a username and a raw password based on first and last name.
     * Username format: firstName.lastName (lowercase).
     * Password format: username + three‑digit random number.
     */
    public static GeneratedCredentials generate(String firstName, String lastName) {
        if (firstName == null || lastName == null) {
            throw new IllegalArgumentException("First name and last name must be provided");
        }
        String username = (firstName + "." + lastName).toLowerCase();
        int suffix = RANDOM.nextInt(1000); // 0‑999
        String password = username + String.format("%03d", suffix);
        return new GeneratedCredentials(username, password);
    }

    /** Simple holder for generated credentials */
    public static class GeneratedCredentials {
        private final String username;
        private final String password;

        public GeneratedCredentials(String username, String password) {
            this.username = username;
            this.password = password;
        }

        public String getUsername() {
            return username;
        }

        public String getPassword() {
            return password;
        }
    }
}
