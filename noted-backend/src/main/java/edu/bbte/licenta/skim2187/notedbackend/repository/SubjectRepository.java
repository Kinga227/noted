package edu.bbte.licenta.skim2187.notedbackend.repository;

import edu.bbte.licenta.skim2187.notedbackend.model.Subject;
import edu.bbte.licenta.skim2187.notedbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    Collection<Subject> findByUser(User user);
}
