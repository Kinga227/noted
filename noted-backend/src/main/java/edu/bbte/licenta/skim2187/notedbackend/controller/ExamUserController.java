package edu.bbte.licenta.skim2187.notedbackend.controller;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.ExamInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.ExamWeekInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.ExamOutDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.ExamWeekOutDto;
import edu.bbte.licenta.skim2187.notedbackend.mapper.ExamMapper;
import edu.bbte.licenta.skim2187.notedbackend.mapper.ExamWeekMapper;
import edu.bbte.licenta.skim2187.notedbackend.model.Exam;
import edu.bbte.licenta.skim2187.notedbackend.model.ExamWeek;
import edu.bbte.licenta.skim2187.notedbackend.model.User;
import edu.bbte.licenta.skim2187.notedbackend.repository.ExamRepository;
import edu.bbte.licenta.skim2187.notedbackend.repository.ExamWeekRepository;
import edu.bbte.licenta.skim2187.notedbackend.repository.UserRepository;
import edu.bbte.licenta.skim2187.notedbackend.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/noted/exams")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class ExamUserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ExamRepository examRepository;

    @Autowired
    ExamWeekRepository examWeekRepository;

    @Autowired
    ExamMapper examMapper;

    @Autowired
    ExamWeekMapper examWeekMapper;

    @Autowired
    JwtService jwtService;

    @GetMapping
    public ResponseEntity<Collection<ExamOutDto>> getExams(@CookieValue(name = "auth", defaultValue = "") String authToken) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Collection<Exam> exams = examRepository.findByUser(user);
                Collection<ExamOutDto> examDtos = exams.stream()
                        .map(examMapper::mapToDto)
                        .collect(Collectors.toList());
                return ResponseEntity.ok(examDtos);
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/weeks")
    public ResponseEntity<Collection<ExamWeekOutDto>> getWeeks(@CookieValue(name = "auth", defaultValue = "") String authToken) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Collection<ExamWeek> examWeeks = examWeekRepository.findByUser(user);
                Collection<ExamWeekOutDto> examWeekDtos = examWeeks.stream()
                        .map(examWeekMapper::mapToDto)
                        .collect(Collectors.toList());
                return ResponseEntity.ok(examWeekDtos);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PatchMapping("/{examId}/date/{newDate}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> updateExamDate(@PathVariable("examId") Long examId, @PathVariable("newDate") Instant newDate) {
        Optional<Exam> examOptional = examRepository.findById(examId);
        if (examOptional.isPresent()) {
            Exam examToUpdate = examOptional.get();
            examToUpdate.setDate(newDate);
            examRepository.saveAndFlush(examToUpdate);
            return ResponseEntity.ok().body("Updated - date");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exam not found.");
        }
    }

    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createExam(@CookieValue(name = "auth", defaultValue = "") String authToken, @RequestBody ExamInDto examInDto) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Exam examToCreate = examMapper.mapToEntity(examInDto);
                examToCreate.setUser(user);
                examRepository.saveAndFlush(examToCreate);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{examId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> deleteExam(@PathVariable("examId") Long examId) {
        Optional<Exam> examOptional = examRepository.findById(examId);
        if (examOptional.isPresent()) {
            Exam examToDelete = examOptional.get();
            examRepository.delete(examToDelete);
            return ResponseEntity.ok().body("Deleted");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Exam not found.");
        }
    }
    @PostMapping("/weeks")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addWeeks(@CookieValue(name = "auth", defaultValue = "") String authToken, @RequestBody Collection<ExamWeekInDto> examWeekInDto) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                List<ExamWeek> examWeeksToSave = new ArrayList<>();
                for (ExamWeekInDto examWeekDto : examWeekInDto) {
                    ExamWeek examWeek = examWeekMapper.mapToEntity(examWeekDto);
                    examWeek.setUser(user);
                    Optional<ExamWeek> existingExamWeekOptional = examWeekRepository.findByUserAndWeekNumber(user, examWeek.getWeekNumber());
                    if (existingExamWeekOptional.isPresent()) {
                        ExamWeek existingExamWeek = existingExamWeekOptional.get();
                        existingExamWeek.setDateOfMonday(examWeek.getDateOfMonday());
                        examWeeksToSave.add(existingExamWeek);
                    } else {
                        examWeeksToSave.add(examWeek);
                    }
                }
                examWeekRepository.saveAll(examWeeksToSave);
                return ResponseEntity.status(HttpStatus.CREATED).build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

}
