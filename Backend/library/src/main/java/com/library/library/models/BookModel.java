package com.library.library.models;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Table(name="book")
@Entity
public class BookModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="idbook")
    private int id_book;

    @Column(name = "title")
    private String title;

    @Column(name = "author")
    private String author;

    @Column(name="language")
    private String language;

    @Column(name = "code")
    private String code;

    @Column(name= "grade")
    private String grade;

    @Column(name= "section")
    private String section;

    @Column(name = "description")
    private String description;

    @Column(name="physical_state")
    private String physical_state;

    @Column(name="status")
    private boolean status;

    @Column(name="price")
    private BigDecimal price;

    //GETTERS AND SETTERS

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getId_book() {
        return id_book;
    }

    public void setId_book(int id_book) {
        this.id_book = id_book;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPhysical_state() {
        return physical_state;
    }

    public void setPhysical_state(String physical_state) {
        this.physical_state = physical_state;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }
}
