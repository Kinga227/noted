package edu.bbte.licenta.skim2187.notedbackend.controller;

import edu.bbte.licenta.skim2187.notedbackend.model.auth.AuthenticationRequest;
import edu.bbte.licenta.skim2187.notedbackend.model.auth.AuthenticationResponse;
import edu.bbte.licenta.skim2187.notedbackend.model.auth.RegistrationRequest;
import edu.bbte.licenta.skim2187.notedbackend.service.AuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/noted/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class AuthController {

    private final AuthenticationService authService;

    @GetMapping
    public ResponseEntity<?> getLoginOrRegistrationPage() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> loginUser(@RequestBody AuthenticationRequest request, HttpServletResponse response) {

        AuthenticationResponse authResponse = authService.login(request);

        if (authResponse.isSuccess()) {
            return ResponseEntity.ok(authResponse);
        } else {
            return ResponseEntity.status(HttpServletResponse.SC_UNAUTHORIZED).body(authResponse);
        }
    }

    @PostMapping("/registration")
    public ResponseEntity<AuthenticationResponse> saveUser(@RequestBody RegistrationRequest request) {
        AuthenticationResponse authResponse = authService.register(request);
        if (authResponse.isSuccess()) {
            return ResponseEntity.ok(authResponse);
        } else if ("Email already exists.".equals(authResponse.getMessage())) {
            return ResponseEntity.status(HttpServletResponse.SC_CONFLICT).body(authResponse);
        } else {
            return ResponseEntity.status(HttpServletResponse.SC_INTERNAL_SERVER_ERROR).body(authResponse);
        }
    }
}
