package com.sd2.model;

import lombok.Data;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;

@NamedQuery(name = "Task.getAllTasks", query = "select t from Task t")
@NamedQuery(name = "Task.updateStatus", query = "update Task t set t.status=:status where t.id =: id")

@Data
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "task")

public class Task implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private  String description;

    @Column(name = "dueDate")
    private String dueDate;

    @Column(name = "employee")
    private String employee;

    @Column(name = "status")
    private String status;


}
