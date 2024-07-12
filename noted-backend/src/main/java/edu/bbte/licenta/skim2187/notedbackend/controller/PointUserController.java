package edu.bbte.licenta.skim2187.notedbackend.controller;

import edu.bbte.licenta.skim2187.notedbackend.dto.incoming.PointInDto;
import edu.bbte.licenta.skim2187.notedbackend.dto.outgoing.PointOutDto;
import edu.bbte.licenta.skim2187.notedbackend.mapper.PointMapper;
import edu.bbte.licenta.skim2187.notedbackend.model.Point;
import edu.bbte.licenta.skim2187.notedbackend.model.Subject;
import edu.bbte.licenta.skim2187.notedbackend.repository.PointRepository;
import edu.bbte.licenta.skim2187.notedbackend.repository.SubjectRepository;
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
@RequestMapping("/api/noted/points")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", allowCredentials = "true")
public class PointUserController {

    @Autowired
    PointRepository pointRepository;

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    PointMapper pointMapper;

    @GetMapping("/{subjectId}")
    public ResponseEntity<Collection<PointOutDto>> getPoints(@PathVariable("subjectId") Long subjectId) {
        Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
        if (subjectOptional.isPresent()) {
            Subject subject = subjectOptional.get();
            Collection<Point> points = pointRepository.findBySubject(subject);
            Collection<PointOutDto> pointDtos = points.stream()
                    .map(pointMapper::mapToDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(pointDtos);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{pointId}/point/{points}")
    public ResponseEntity<?> updatePoint(@PathVariable("pointId") Long pointId, @PathVariable("points") Double pointsToAdd) {
        Optional<Point> pointOptional = pointRepository.findById(pointId);
        if (pointOptional.isPresent()) {
            Point pointToUpdate = pointOptional.get();
            pointToUpdate.setPoints(pointToUpdate.getPoints() + pointsToAdd);
            pointRepository.saveAndFlush(pointToUpdate);
            return ResponseEntity.ok().body("Updated - added points");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Point not found.");
        }
    }

    @PostMapping("/{subjectId}/new")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> createPoint(@PathVariable("subjectId") Long subjectId, @RequestBody PointInDto pointInDto) {
        Optional<Subject> subjectOptional = subjectRepository.findById(subjectId);
        Double points = 0.0;
        if (subjectOptional.isPresent()) {
            Subject subject = subjectOptional.get();
            if (Objects.equals(pointInDto.getTypeName(), "Total")) {
                Point existingTotal = pointRepository.findByTypeNameAndAndSubject("Total", subject);
                if (existingTotal != null) {
                    points = existingTotal.getPoints();
                    pointRepository.delete(existingTotal);
                }
            }
            Point pointToCreate = pointMapper.mapToEntity(pointInDto);
            pointToCreate.setSubject(subject);
            pointToCreate.setPoints(points);
            pointRepository.saveAndFlush(pointToCreate);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
