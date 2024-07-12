package edu.bbte.licenta.skim2187.notedbackend.controller;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.SubjectInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.SubjectOutDto;
import edu.bbte.licenta.skim2187.notedbackend.mapper.SubjectMapper;
import edu.bbte.licenta.skim2187.notedbackend.model.Subject;
import edu.bbte.licenta.skim2187.notedbackend.model.User;
import edu.bbte.licenta.skim2187.notedbackend.repository.SubjectRepository;
import edu.bbte.licenta.skim2187.notedbackend.repository.UserRepository;
import edu.bbte.licenta.skim2187.notedbackend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/noted/subjects")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class SubjectUserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    SubjectMapper subjectMapper;

    @Autowired
    JwtService jwtService;

    @GetMapping
    public ResponseEntity<Collection<SubjectOutDto>> getSubjects(@CookieValue(name = "auth", defaultValue = "") String authToken) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Collection<Subject> subjects = subjectRepository.findByUser(user);
                Collection<SubjectOutDto> subjectDtos = subjects.stream()
                        .map(subjectMapper::mapToDto)
                        .collect(Collectors.toList());
                return ResponseEntity.ok(subjectDtos);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PatchMapping("/{subjectId}/formula")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> updateSubjectGradingFormula(@PathVariable("subjectId") Long subjectId, @RequestBody Map<String, String> requestBody) {
        String newFormula = requestBody.get("formula");
        Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
        if (subjectOptional.isPresent()) {
            Subject subjectToUpdate = subjectOptional.get();
            subjectToUpdate.setGradingFormula(newFormula);
            subjectRepository.saveAndFlush(subjectToUpdate);
            return ResponseEntity.ok().body("Updated - formula");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subject not found.");
        }
    }

    @PatchMapping("/{subjectId}/minutes/{minutes}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> updateSubjectMinutesSpent(@PathVariable("subjectId") Long subjectId, @PathVariable("minutes") Integer minutes) {
        Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
        if (subjectOptional.isPresent()) {
            Subject subjectToUpdate = subjectOptional.get();
            subjectToUpdate.setMinutesSpent(subjectToUpdate.getMinutesSpent() + minutes);
            subjectRepository.saveAndFlush(subjectToUpdate);
            return ResponseEntity.ok().body("Updated - time");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subject not found");
        }
    }

    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createSubject(@CookieValue(name = "auth", defaultValue = "") String authToken, @RequestBody SubjectInDto subjectInDto) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Subject subjectToCreate = subjectMapper.mapToEntity(subjectInDto);
                subjectToCreate.setUser(user);
                subjectRepository.saveAndFlush(subjectToCreate);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{subjectId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> deleteSubject(@PathVariable("subjectId") Long subjectId) {
        Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
        if (subjectOptional.isPresent()) {
            Subject subjectToDelete = subjectOptional.get();
            subjectRepository.delete(subjectToDelete);
            return ResponseEntity.ok().body("Deleted");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Subject not found.");
        }
    }

    @GetMapping("/{subjectId}/gradingFormula")
    public ResponseEntity<String> getGradingFormulaById(@PathVariable("subjectId") Long subjectId) {
        Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
        if (subjectOptional.isPresent()) {
            Subject subject = subjectOptional.get();
            if (subject.getGradingFormula() == null) {
                return ResponseEntity.ok().body("-1");
            } else {
                return ResponseEntity.ok().body(subject.getGradingFormula());
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
