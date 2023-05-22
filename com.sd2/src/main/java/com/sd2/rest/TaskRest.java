package com.sd2.rest;

import com.sd2.model.Task;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "/task")
public interface TaskRest {

    @PostMapping(path = "/add")
    ResponseEntity<String> addNewTask(@RequestBody(required = true)Map<String, String> requestMap);

    @GetMapping(path = "/get")
    ResponseEntity<List<Task>> getAllTasks(@RequestBody(required = false)String filterValue);

    @PostMapping(path = "/update")
    public ResponseEntity<String> update(@RequestBody(required = true)Map<String, String>requestMap);

    @PostMapping(path = "/delete/{id}")
    ResponseEntity<String> deleteTask(@PathVariable Integer id);


}
