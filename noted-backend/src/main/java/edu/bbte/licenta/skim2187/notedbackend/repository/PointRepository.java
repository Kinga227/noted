package edu.bbte.licenta.skim2187.notedbackend.repository;

import edu.bbte.licenta.skim2187.notedbackend.model.Point;
import edu.bbte.licenta.skim2187.notedbackend.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface PointRepository extends JpaRepository<Point, Long> {

    Collection<Point> findBySubject(Subject subject);
    Point findByTypeNameAndAndSubject(String typeName, Subject subject);
}
