package com.library.library;

import com.library.library.excepcion.ValidationException;
import com.library.library.models.BookModel;
import com.library.library.models.LoanModel;
import com.library.library.repositories.IBookRepository;
import com.library.library.repositories.ILoanRepository;
import com.library.library.services.BookService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class BookApplicationTest {

	@InjectMocks
	private BookService bookService;

	@Mock
	private IBookRepository bookRepository;

	@Mock
	private ILoanRepository loanRepository;


	//Get all books successful
	@Test
	void getAllBooks_Success() {
		BookModel book1 = new BookModel();
		book1.setCode("001");
		book1.setTitle("Book One");
		book1.setAuthor("Author One");
		book1.setLanguage("English");
		book1.setGrade("secundaria");
		book1.setSection("A");
		book1.setDescription("Description One");
		book1.setPhysical_state("New");
		book1.setStatus(true);

		BookModel book2 = new BookModel();
		book2.setCode("002");
		book2.setTitle("Book Two");
		book2.setAuthor("Author Two");
		book2.setLanguage("Spanish");
		book2.setGrade("secundaria");
		book2.setSection("B");
		book2.setDescription("Description Two");
		book2.setPhysical_state("Good");
		book2.setStatus(true);

		List<BookModel> bookList = Arrays.asList(book1, book2);
		when(bookRepository.findAll()).thenReturn(bookList);

		List<BookModel> books = bookService.getAllBooks();

		assertNotNull(books);
		assertEquals(2, books.size());
		assertEquals("Book One", books.get(0).getTitle());
		assertEquals("Book Two", books.get(1).getTitle());
		verify(bookRepository, times(1)).findAll();
	}

	// Get all Books Exception
	@Test
	void getAllBooks_BooksRegisterIsEmpty() {
		when(bookRepository.findAll()).thenReturn(Collections.emptyList());

		List<BookModel> books = bookService.getAllBooks();
		assertNotNull(books);
		assertTrue(books.isEmpty(),"Se esperaba que la lista de libros estuviera vacía");
	}

	//Get All Books Error
	@Test
	void getAllBooks_DatabaseError() {
		when(bookRepository.findAll()).thenThrow(new RuntimeException("Database connection error"));

		try {
			bookService.getAllBooks();
			fail("Se esperaba una excepción RuntimeException");
		} catch (RuntimeException e) {
			assertEquals("Error al obtener la lista de libros", e.getMessage());
		}
	}

	/*------------------------------------------------------------------------------------------------------------*/

	//Get book by id
	@Test
	void getBookById_Success() {
		BookModel book = new BookModel();
		book.setCode("001");
		book.setTitle("Book One");
		book.setAuthor("Author One");
		book.setLanguage("English");
		book.setGrade("secundaria");
		book.setSection("A");
		book.setDescription("Description One");
		book.setPhysical_state("New");
		book.setStatus(true);

		when(bookRepository.findById(1)).thenReturn(Optional.of(book));

		Optional<BookModel> result = bookService.getBookById(1);

		assertTrue(result.isPresent());
		assertEquals("Book One", result.get().getTitle());
		verify(bookRepository, times(1)).findById(1);
	}

	//Get book by id when is not found
	@Test
	void getBookById_NotFound() {
		when(bookRepository.findById(1)).thenReturn(Optional.empty());

		Optional<BookModel> result = bookService.getBookById(1);

		assertFalse(result.isPresent());
		verify(bookRepository, times(1)).findById(1);
	}

	/*-------------------------------------------------------------------------------------------------------------*/
	//obtener libros con datos personalizados
	@Test
	void getBookSomeData_Success() {
		BookModel book1 = new BookModel();
		book1.setCode("001");
		book1.setTitle("Book One");
		book1.setAuthor("Author One");
		book1.setDescription("Description One");
		book1.setStatus(true);

		BookModel book2 = new BookModel();
		book2.setCode("002");
		book2.setTitle("Book Two");
		book2.setAuthor("Author Two");
		book2.setDescription("Description Two");
		book2.setStatus(true);

		List<BookModel> books = Arrays.asList(book1, book2);
		when(bookRepository.findAll()).thenReturn(books);

		List<Map<String, Object>> result = bookService.getBookSomeData();

		assertNotNull(result);
		assertEquals(2, result.size());
		assertEquals("001", result.get(0).get("code"));
		assertEquals("Book One", result.get(0).get("title"));
		assertEquals("Author One", result.get(0).get("author"));
		assertEquals("Description One", result.get(0).get("description"));
		assertTrue((Boolean) result.get(0).get("status"));

		assertEquals("002", result.get(1).get("code"));
		assertEquals("Book Two", result.get(1).get("title"));
		assertEquals("Author Two", result.get(1).get("author"));
		assertEquals("Description Two", result.get(1).get("description"));
		assertTrue((Boolean) result.get(1).get("status"));

		verify(bookRepository, times(1)).findAll();
	}

	// Get some book data Exception
	@Test
	void getBooksSomeData_RegisterIsEmpty() {
		when(bookRepository.findAll()).thenReturn(Collections.emptyList());

		List<Map<String, Object>> books = bookService.getBookSomeData();
		assertNotNull(books);
		assertTrue(books.isEmpty(),"Se esperaba que la lista de libros estuviera vacía");
	}

	//Get some book data Error
	@Test
	void getBooksSomeData_DatabaseError() {
		when(bookRepository.findAll()).thenThrow(new RuntimeException("Database connection error"));

		try {
			bookService.getBookSomeData();
			fail("Se esperaba una excepción RuntimeException");
		} catch (RuntimeException e) {
			assertEquals("Error al obtener la lista de libros", e.getMessage());
		}
	}

	/*--------------------------------------------------------------------------------------------------------*/
	// Guardar un nuevo usuario exitosamente
	@Test
	void saveBook_Success() {
		BookModel book = new BookModel();
		book.setCode("001");
		book.setTitle("Book One");
		book.setAuthor("Author One");
		book.setLanguage("English");
		book.setGrade("secundaria");
		book.setSection("A");
		book.setDescription("Description One");
		book.setPhysical_state("New");
		book.setPrice(BigDecimal.valueOf(90.00));

		when(bookRepository.findByCode("001")).thenReturn(Optional.empty());

		when(bookRepository.save(book)).thenReturn(book);

		BookModel result = bookService.saveBook(book);

		assertNotNull(result);
		assertEquals("001", result.getCode());
		assertTrue(result.isStatus());
		verify(bookRepository, times(1)).findByCode("001");
		verify(bookRepository, times(1)).save(book);
	}

	@Test
	void saveBook_InvalidData() {
		BookModel invalidBook = new BookModel();
		invalidBook.setTitle("libro de la decadencia publicado el 14 de mayor de 19999 en el dia de no se cuando ");
		invalidBook.setAuthor("libro de la decadencia publicado el 14 de mayor de 19999 en el dia de no se cuando ");
		invalidBook.setLanguage("Spanglish2222");
		invalidBook.setCode("22222222222222222222222222222222222222222222222222222222");
		invalidBook.setGrade("5thGrade");
		invalidBook.setSection("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
		invalidBook.setDescription("Una historia emocionante de aventura y amistad en un mundo lleno de misterios por descubrir......");
		invalidBook.setPhysical_state("Torssssssssssssssssssssssssssssss2n");

		when(bookRepository.findByCode(String.valueOf(invalidBook.getCode()))).thenReturn(Optional.empty());

		try {
			bookService.saveBook(invalidBook);
			fail("Se esperaba una excepción ValidationException para datos inválidos");
		} catch (ValidationException e) {
			// Verificar que la excepción contiene los errores correctos
			List<String> errors = e.getErrors();
			assertTrue(errors.contains("Título Inválido"), "Error esperado: Título Inválido");
			assertTrue(errors.contains("Autor Inválido"), "Error esperado: Autor Inválido");
			assertTrue(errors.contains("Idioma Inválido"), "Error esperado: Idioma Inválido");
			assertTrue(errors.contains("Código Inválido"), "Error esperado: Código Inválido");
			assertTrue(errors.contains("Grado Inválido"), "Error esperado: Grado Inválido");
			assertTrue(errors.contains("Sección Inválida"), "Error esperado: Sección Inválida");
			assertTrue(errors.contains("Estado Físico Inválido"), "Error esperado: Estado Físico Inválido");
		}

		// Verificar que el repositorio save() no haya sido llamado
		verify(bookRepository, times(0)).save(any(BookModel.class));
	}

	/*------------------------------------------------------------------------------------------------------------*/
	//Editar un libro encontrado
	@Test
	void updateBook_Success() {
		BookModel existingBook = new BookModel();
		existingBook.setId_book(1);
		existingBook.setCode("001");
		existingBook.setTitle("Old Book");
		existingBook.setAuthor("Old Author");
		existingBook.setLanguage("Spanish");
		existingBook.setGrade("secundaria");
		existingBook.setSection("A");
		existingBook.setDescription("Old Description");
		existingBook.setPhysical_state("Good");
		existingBook.setPrice(BigDecimal.valueOf(90.00));
		existingBook.setStatus(true);

		// Crear libro actualizado
		BookModel updatedBook = new BookModel();
		updatedBook.setCode("001");
		updatedBook.setTitle("Updated Book");
		updatedBook.setAuthor("Updated Author");
		updatedBook.setLanguage("English");
		updatedBook.setGrade("secundaria");
		updatedBook.setSection("A");
		updatedBook.setDescription("Updated Description");
		updatedBook.setPhysical_state("Good");
		updatedBook.setPrice(BigDecimal.valueOf(80.00));
		updatedBook.setStatus(true);

		when(bookRepository.findById(1)).thenReturn(Optional.of(existingBook));
		when(bookRepository.save(any(BookModel.class))).thenReturn(updatedBook);

		BookModel result = bookService.updateBook(updatedBook, 1);

		// Verificar resultados
		assertNotNull(result);
		assertEquals("Updated Book", result.getTitle());
		assertEquals("Updated Author", result.getAuthor());
		assertEquals("Updated Description", result.getDescription());
		assertEquals("English", result.getLanguage());
		assertEquals("secundaria", result.getGrade());
		assertEquals("A", result.getSection());

	}

	//Update book is Not Found
	@Test
	void updateBook_NotFound() {
		BookModel request = new BookModel();
		request.setCode("001");

		when(bookRepository.findById(1)).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> bookService.updateBook(request, 1));

		verify(bookRepository, times(1)).findById(1);
	}

	// Book update with duplicate code
	@Test
	void updateBook_DuplicateCode() {
		BookModel existingBook = new BookModel();
		existingBook.setId_book(1);
		existingBook.setTitle("Libro Original");
		existingBook.setAuthor("Autor Original");
		existingBook.setLanguage("Español");
		existingBook.setCode("123456");
		existingBook.setGrade("Secundaria");
		existingBook.setSection("A");
		existingBook.setDescription("Descripción Original");
		existingBook.setPhysical_state("Nuevo");

		BookModel updatedBook = new BookModel();
		updatedBook.setTitle("Libro Actualizado");
		updatedBook.setAuthor("Autor Actualizado");
		updatedBook.setLanguage("Inglés");
		updatedBook.setCode("654321");
		updatedBook.setGrade("Secundaria");
		updatedBook.setSection("B");
		updatedBook.setDescription("Descripción Actualizada");
		updatedBook.setPhysical_state("Usado");

		when(bookRepository.findById(1)).thenReturn(Optional.of(existingBook));

		when(bookRepository.findByCode("654321")).thenReturn(Optional.of(new BookModel()));

		ValidationException exception = assertThrows(ValidationException.class, () -> {
			bookService.updateBook(updatedBook, 1);
		});

		assertNotNull(exception);
		List<String> errors = exception.getErrors();
		assertTrue(errors.contains("El libro con la código 654321 ya se encuentra registrado dentro del sistema"));
	}

	/*--------------------------------------------------------------------------------------------------------------*/
	//Disable book successful
	@Test
	void deleteBook_Success() {
		BookModel existingBook = new BookModel();
		existingBook.setCode("001");
		existingBook.setTitle("Book One");
		existingBook.setAuthor("Author One");
		existingBook.setDescription("Description One");
		existingBook.setStatus(true);

		when(bookRepository.findById(1)).thenReturn(Optional.of(existingBook));

		when(bookRepository.save(existingBook)).thenReturn(existingBook);

		when(loanRepository.findAll()).thenReturn(new ArrayList<>());
		BookModel result = bookService.deleteBook(1);

		assertNotNull(result);
		assertFalse(result.isStatus());
		verify(bookRepository, times(1)).findById(1);
		verify(bookRepository, times(1)).save(existingBook);
	}

	//Disable book not found
	@Test
	void deleteBook_NotFound() {
		when(bookRepository.findById(1)).thenReturn(Optional.empty());

		assertThrows(RuntimeException.class, () -> bookService.deleteBook(1));

		verify(bookRepository, times(1)).findById(1);
	}

	//Disable book with a loan active
	@Test
	void deleteBook_WithLoanActive() {
		BookModel book = new BookModel();
		book.setId_book(1);
		book.setTitle("Don quijote");
		book.setStatus(true);

		when(bookRepository.findById(1)).thenReturn(Optional.of(book));

		LoanModel loan = new LoanModel();
		loan.setBook(book);
		loan.setConfirm_devolution(false);

		when(loanRepository.findAll()).thenReturn(Collections.singletonList(loan));

		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			bookService.deleteBook(1);
		});

		assertEquals("El libro se encuentra en préstamos pendientes y no puede ser deshabilitado.", exception.getMessage());
	}

	/*-----------------------------------------------------------------------------------------------------------------*/


}
