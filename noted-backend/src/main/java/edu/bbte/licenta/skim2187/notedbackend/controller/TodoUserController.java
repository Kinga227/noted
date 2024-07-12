package edu.bbte.licenta.skim2187.notedbackend.controller;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.NoteInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.ToDoInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.WeekInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.NoteOutDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.ToDoOutDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.WeekOutDto;
import edu.bbte.licenta.skim2187.notedbackend.mapper.NoteMapper;
import edu.bbte.licenta.skim2187.notedbackend.mapper.ToDoMapper;
import edu.bbte.licenta.skim2187.notedbackend.mapper.WeekMapper;
import edu.bbte.licenta.skim2187.notedbackend.model.Note;
import edu.bbte.licenta.skim2187.notedbackend.model.ToDo;
import edu.bbte.licenta.skim2187.notedbackend.model.User;
import edu.bbte.licenta.skim2187.notedbackend.model.Week;
import edu.bbte.licenta.skim2187.notedbackend.repository.NoteRepository;
import edu.bbte.licenta.skim2187.notedbackend.repository.ToDoRepository;
import edu.bbte.licenta.skim2187.notedbackend.repository.UserRepository;
import edu.bbte.licenta.skim2187.notedbackend.repository.WeekRepository;
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
@RequestMapping("/api/noted/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class TodoUserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ToDoRepository toDoRepository;

    @Autowired
    WeekRepository weekRepository;

    @Autowired
    NoteRepository noteRepository;

    @Autowired
    ToDoMapper toDoMapper;

    @Autowired
    WeekMapper weekMapper;

    @Autowired
    NoteMapper noteMapper;

    @Autowired
    JwtService jwtService;

    @GetMapping
    public ResponseEntity<Collection<ToDoOutDto>> getToDos(@CookieValue(name = "auth", defaultValue = "") String authToken) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Collection<ToDo> todos = toDoRepository.findByUser(user);
                Collection<ToDoOutDto> todoDtos = todos.stream()
                        .map(toDoMapper::mapToDto)
                        .collect(Collectors.toList());
                return ResponseEntity.ok(todoDtos);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/notes")
    public ResponseEntity<Collection<NoteOutDto>> getNotes(@CookieValue(name = "auth", defaultValue = "") String authToken) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Collection<Note> notes = noteRepository.findByUser(user);
                Collection<NoteOutDto> noteDtos = notes.stream()
                        .map(noteMapper::mapToDto)
                        .collect(Collectors.toList());
                return ResponseEntity.ok(noteDtos);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/weeks")
    public ResponseEntity<Collection<WeekOutDto>> getWeeks(@CookieValue(name = "auth", defaultValue = "") String authToken) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Collection<Week> weeks = weekRepository.findByUser(user);
                Collection<WeekOutDto> weekDtos = weeks.stream()
                        .map(weekMapper::mapToDto)
                        .collect(Collectors.toList());
                return ResponseEntity.ok(weekDtos);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/{todoId}/done")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> updateTodoDone(@PathVariable("todoId") Long todoId) {
        Optional<ToDo> toDoOptional = toDoRepository.findById(todoId);
        if (toDoOptional.isPresent()) {
            ToDo todoToUpdate = toDoOptional.get();
            todoToUpdate.setDone(!todoToUpdate.getDone());
            toDoRepository.saveAndFlush(todoToUpdate);
            return ResponseEntity.status(HttpStatus.OK).body("Updated - done");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("To do not found.");
        }
    }

    @PostMapping("/note/{noteId}/done")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> updateNoteDone(@PathVariable("noteId") Long noteId) {
        Optional<Note> noteOptional = noteRepository.findById(noteId);
        if (noteOptional.isPresent()) {
            Note noteToUpdate = noteOptional.get();
            noteToUpdate.setDone(!noteToUpdate.getDone());
            noteRepository.saveAndFlush(noteToUpdate);
            return ResponseEntity.status(HttpStatus.OK).body("Updated - done");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found.");
        }
    }

    @PatchMapping("/{todoId}/date/{newDate}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> updateTodoDate(@PathVariable("todoId") Long todoId, @PathVariable("newDate") Instant newDate) {
        Optional<ToDo> toDoOptional = toDoRepository.findById(todoId);
        if (toDoOptional.isPresent()) {
            ToDo todoToUpdate = toDoOptional.get();
            todoToUpdate.setDate(newDate);
            toDoRepository.saveAndFlush(todoToUpdate);
            return ResponseEntity.status(HttpStatus.OK).body("Updated - date");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("To do not found.");
        }
    }

    @PatchMapping("{noteId}/weekNumber/{newWeekNumber}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> updateNoteWeekNumber(@PathVariable("noteId") Long noteId, @PathVariable("newWeekNumber") Integer newWeekNumber) {
        Optional<Note> noteOptional = noteRepository.findById(noteId);
        if (noteOptional.isPresent()) {
            Note noteToUpdate = noteOptional.get();
            noteToUpdate.setWeekNumber(newWeekNumber);
            noteRepository.saveAndFlush(noteToUpdate);
            return ResponseEntity.status(HttpStatus.OK).body("Updated - week number");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found.");
        }
    }

    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createToDo(@CookieValue(name = "auth", defaultValue = "") String authToken, @RequestBody ToDoInDto toDoInDto) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                ToDo toDoToCreate = toDoMapper.mapToEntity(toDoInDto);
                toDoToCreate.setUser(user);
                toDoRepository.saveAndFlush(toDoToCreate);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/note/new")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createNote(@CookieValue(name = "auth", defaultValue = "") String authToken, @RequestBody NoteInDto noteInDto) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Note noteToCreate = noteMapper.mapToEntity(noteInDto);
                noteToCreate.setUser(user);
                noteRepository.saveAndFlush(noteToCreate);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{todoId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> deleteToDo(@PathVariable("todoId") Long todoId) {
        Optional<ToDo> toDoOptional = toDoRepository.findById(todoId);
        if (toDoOptional.isPresent()) {
            ToDo todoToDelete = toDoOptional.get();
            toDoRepository.delete(todoToDelete);
            return ResponseEntity.status(HttpStatus.OK).body("Deleted");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("To do not found.");
        }
    }

    @DeleteMapping("/note/{noteId}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> deleteNote(@PathVariable("noteId") Long noteId) {
        Optional<Note> noteOptional = noteRepository.findById(noteId);
        if (noteOptional.isPresent()) {
            Note noteToDelete = noteOptional.get();
            noteRepository.delete(noteToDelete);
            return ResponseEntity.status(HttpStatus.OK).body("Deleted");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Note not found.");
        }
    }

    @PostMapping("/weeks")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addWeeks(@CookieValue(name = "auth", defaultValue = "") String authToken, @RequestBody Collection<WeekInDto> weekInDto) {
        Optional<String> emailOptional = jwtService.extractEmail(authToken);
        if (emailOptional.isPresent()) {
            String email = emailOptional.get();
            Optional<User> userOptional = userRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                List<Week> weeksToSave = new ArrayList<>();
                for (WeekInDto weekDto : weekInDto) {
                    Week week = weekMapper.mapToEntity(weekDto);
                    week.setUser(user);
                    Optional<Week> existingWeekOptional = weekRepository.findByUserAndWeekNumber(user, week.getWeekNumber());
                    if (existingWeekOptional.isPresent()) {
                        Week existingWeek = existingWeekOptional.get();
                        existingWeek.setDateOfMonday(week.getDateOfMonday());
                        weeksToSave.add(existingWeek);
                    } else {
                        weeksToSave.add(week);
                    }
                }
                weekRepository.saveAll(weeksToSave);
                return ResponseEntity.status(HttpStatus.CREATED).build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


}
