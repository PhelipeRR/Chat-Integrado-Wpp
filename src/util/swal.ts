import Swal from 'sweetalert2';


export default class SweetAlert2 {
  static error(text:string) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      html: text,
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#194162',
    });
  }

  static success(text:string) {
    Swal.fire({
      icon: 'success',
      title: 'Sucesso!',
      html: text,
      showConfirmButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#194162',
    });
  }

  static async confirm(text:string) {
    return await Swal.fire({
      icon: 'warning',
      title: 'Oops...',
      html: text,
      showCancelButton: true,
      confirmButtonColor: '#218838',
      cancelButtonColor: '#dc3545',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não'
    });
  }
}