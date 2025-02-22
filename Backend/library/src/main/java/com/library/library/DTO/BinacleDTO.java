package com.library.library.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class BinacleDTO {

    private String codeBook;
    private String author;
    private String grade;
    private String title;
    private String language;
    private String section;
    private String user_name;
    private String user_last_name;
    private String mail;
    private String role;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date acquisition_date;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date date_of_devolution;
    private boolean confirm_devolution;
    public String getCodeBook() {
        return codeBook;
    }

    public void setCodeBook(String codeBook) {
        this.codeBook = codeBook;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getUser_last_name() {
        return user_last_name;
    }

    public void setUser_last_name(String user_last_name) {
        this.user_last_name = user_last_name;
    }

    public String getMail() {
        return mail;
    }

    public void setMail(String mail) {
        this.mail = mail;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Date getAcquisition_date() {
        return acquisition_date;
    }

    public void setAcquisition_date(Date acquisition_date) {
        this.acquisition_date = acquisition_date;
    }

    public Date getDate_of_devolution() {
        return date_of_devolution;
    }

    public void setDate_of_devolution(Date date_of_devolution) {
        this.date_of_devolution = date_of_devolution;
    }

    public boolean isConfirm_devolution() {
        return confirm_devolution;
    }

    public void setConfirm_devolution(boolean confirm_devolution) {
        this.confirm_devolution = confirm_devolution;
    }

}
