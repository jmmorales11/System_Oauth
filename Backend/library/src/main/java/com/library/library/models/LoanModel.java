package com.library.library.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.util.Date;

@Table(name = "loan")
@Entity
public class LoanModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="idloan")
    private int idloan;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "acquisition_date")
    private Date acquisition_date;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "date_of_devolution")
    private Date date_of_devolution;

    @ManyToOne
    @JoinColumn(name = "book_idbook", referencedColumnName = "idbook")
    private BookModel book;

    @ManyToOne
    @JoinColumn(name = "user_iduser", referencedColumnName = "iduser")
    private UserModel user;

    @Column(name = "confirm_devolution")
    private boolean confirm_devolution;


    //Getters and setters
    public int getIdloan() {
        return idloan;
    }

    public void setIdloan(int idloan) {
        this.idloan = idloan;
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

    public BookModel getBook() {
        return book;
    }

    public void setBook(BookModel book) {
        this.book = book;
    }

    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel user) {
        this.user = user;
    }

    public boolean isConfirm_devolution() {
        return confirm_devolution;
    }

    public void setConfirm_devolution(boolean confirm_devolution) {
        this.confirm_devolution = confirm_devolution;
    }
}
