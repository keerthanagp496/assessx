package com.sentinelassess.repository;
import com.sentinelassess.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface PracticeQuestionRepository extends JpaRepository<PracticeQuestion,Long>{
 List<PracticeQuestion> findByActiveTrue();
}
