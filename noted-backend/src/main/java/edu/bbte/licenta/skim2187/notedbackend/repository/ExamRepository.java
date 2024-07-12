package edu.bbte.licenta.skim2187.notedbackend.repository;

import edu.bbte.licenta.skim2187.notedbackend.model.Exam;
import edu.bbte.licenta.skim2187.notedbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface ExamRepository extends JpaRepository<Exam, Long> {

    Collection<Exam> findByUser(User user);
}
