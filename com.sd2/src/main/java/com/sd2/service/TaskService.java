package com.sd2.service;

import com.sd2.model.Task;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface TaskService {

    ResponseEntity<String> addNewTask(Map<String, String> requestMap);

    ResponseEntity<List<Task>> getAllTasks(String filterValue);

    ResponseEntity<String> update(Map<String, String> requestMap);

    ResponseEntity<String> deleteTask(Integer id);



}
