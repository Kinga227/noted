package edu.bbte.licenta.skim2187.notedbackend.repository;

import edu.bbte.licenta.skim2187.notedbackend.model.User;
import edu.bbte.licenta.skim2187.notedbackend.model.Week;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Optional;

public interface WeekRepository extends JpaRepository<Week, Long> {

    Collection<Week> findByUser(User user);
    Optional<Week> findByUserAndWeekNumber(User user, Integer number);
}
