package edu.bbte.licenta.skim2187.notedbackend.repository;

import edu.bbte.licenta.skim2187.notedbackend.model.Class;
import edu.bbte.licenta.skim2187.notedbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface ClassRepository extends JpaRepository<Class, Long> {

    Collection<Class> findByUser(User user);
}
