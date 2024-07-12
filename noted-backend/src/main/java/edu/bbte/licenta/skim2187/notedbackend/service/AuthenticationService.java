package edu.bbte.licenta.skim2187.notedbackend.service;

import edu.bbte.licenta.skim2187.notedbackend.model.User;
import edu.bbte.licenta.skim2187.notedbackend.model.auth.*;
import edu.bbte.licenta.skim2187.notedbackend.repository.TokenRepository;
import edu.bbte.licenta.skim2187.notedbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse login(AuthenticationRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            var user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            var jwtToken = jwtService.generateToken(user);
            revokeAllUserTokens(user);
            saveUserToken(user, jwtToken);

            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .success(true)
                    .message("Login successful")
                    .build();
        } catch (AuthenticationException e) {
            return AuthenticationResponse.builder()
                    .success(false)
                    .message("Invalid email or password.")
                    .build();
        } catch (Exception e) {
            return AuthenticationResponse.builder()
                    .success(false)
                    .message("Internal server error occurred.")
                    .build();
        }
    }

    public AuthenticationResponse register(RegistrationRequest request) {
        try {
            if (userRepository.existsUserByEmail(request.getEmail())) {
                return AuthenticationResponse.builder()
                        .success(false)
                        .message("Email already exists.")
                        .build();
            }
            var user = User.builder()
                    .fullName(request.getFullName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .build();
            var savedUser = userRepository.save(user);
            var jwtToken = jwtService.generateToken(user);
            saveUserToken(savedUser, jwtToken);

            return AuthenticationResponse.builder()
                    .token(jwtToken)
                    .success(true)
                    .message("Registration successful")
                    .build();
        } catch (Exception e) {
            return AuthenticationResponse.builder()
                    .success(false)
                    .message("Internal server error occurred.")
                    .build();
        }
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty()) {
            return;
        }
        validUserTokens.forEach(t -> {
            t.setExpired(true);
            t.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }
}