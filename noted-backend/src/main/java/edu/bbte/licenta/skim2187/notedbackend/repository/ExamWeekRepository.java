package edu.bbte.licenta.skim2187.notedbackend.repository;

import edu.bbte.licenta.skim2187.notedbackend.model.ExamWeek;
import edu.bbte.licenta.skim2187.notedbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface ExamWeekRepository extends JpaRepository<ExamWeek, Long> {

    Collection<ExamWeek> findByUser(User user);
    Optional<ExamWeek> findByUserAndWeekNumber(User user, Integer number);
}
