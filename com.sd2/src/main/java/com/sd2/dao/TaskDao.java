package com.sd2.dao;

import com.sd2.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;

public interface TaskDao extends JpaRepository<Task, Integer> {
    List<Task> getAllTasks();

    @Transactional
    @Modifying
    Integer updateStatus(@Param("status")String status, @Param("id")Integer id);
}
