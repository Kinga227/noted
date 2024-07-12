package edu.bbte.licenta.skim2187.notedbackend.controller;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.ClassInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.ClassOutDto;
import edu.bbte.licenta.skim2187.notedbackend.mapper.ClassMapper;
import edu.bbte.licenta.skim2187.notedbackend.model.Class;
import edu.bbte.licenta.skim2187.notedbackend.model.Subject;
import edu.bbte.licenta.skim2187.notedbackend.model.User;
import edu.bbte.licenta.skim2187.notedbackend.repository.ClassRepository;
import edu.bbte.licenta.skim2187.notedbackend.repository.SubjectRepository;
import edu.bbte.licenta.skim2187.notedbackend.repository.UserRepository;
import edu.bbte.licenta.skim2187.notedbackend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/noted/classes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class ClassUserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ClassRepository classRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    ClassMapper classMapper;

    @Autowired
    JwtService jwtService;

    @GetMapping
    public ResponseEntity<Collection<ClassOutDto>> getClasses(@CookieValue(name = "auth", defaultValue = "") String authToken) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Collection<Class> classes = classRepository.findByUser(user);
                Collection<ClassOutDto> classDtos = classes.stream()
                        .map(classMapper::mapToDto)
                        .collect(Collectors.toList());
                return ResponseEntity.ok(classDtos);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createClass(@CookieValue(name = "auth", defaultValue = "") String authToken, @RequestBody ClassInDto classInDto) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Optional<Subject> subjectOptional = subjectRepository.findById(classInDto.getSubjectId());
                if (subjectOptional.isPresent()) {
                    Subject subject = subjectOptional.get();
                    Class classToCreate = classMapper.mapToEntity(classInDto);
                    classToCreate.setUser(user);
                    classToCreate.setSubject(subject);
                    if (Objects.equals(classToCreate.getStartHour(), "8:00")) {
                        classToCreate.setStartHour("08:00");
                    }
                    classRepository.saveAndFlush(classToCreate);
                    return ResponseEntity.ok().build();
                } else {
                    return ResponseEntity.notFound().build();
                }
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{classId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> deleteClass(@PathVariable("classId") Long classId) {
        Optional<Class> classOptional = classRepository.findById(classId);
        if (classOptional.isPresent()) {
            Class classToDelete = classOptional.get();
            classRepository.delete(classToDelete);
            return ResponseEntity.ok().body("Deleted");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Class not found.");
        }
    }
}
