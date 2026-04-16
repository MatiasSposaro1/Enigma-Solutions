/* ═══════════════════════════════════════════
   Contact Form Module
   ═══════════════════════════════════════════ */

export class FormValidator {
  constructor(form) {
    this.form = form
  }

  static isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  validate() {
    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const subject = document.getElementById('subject').value.trim()
    const message = document.getElementById('message').value.trim()
    const errors = []

    if (!name) {
      errors.push({ field: 'name', message: 'Por favor, ingrese su nombre.' })
    } else if (name.length < 2) {
      errors.push({
        field: 'name',
        message: 'El nombre debe tener al menos 2 caracteres.',
      })
    }

    if (!email) {
      errors.push({ field: 'email', message: 'Por favor, ingrese su email.' })
    } else if (!FormValidator.isValidEmail(email)) {
      errors.push({
        field: 'email',
        message: 'Por favor, ingrese un email válido.',
      })
    }

    if (!subject) {
      errors.push({
        field: 'subject',
        message: 'Por favor, ingrese un asunto.',
      })
    }

    if (!message) {
      errors.push({
        field: 'message',
        message: 'Por favor, ingrese un mensaje.',
      })
    } else if (message.length < 10) {
      errors.push({
        field: 'message',
        message: 'El mensaje debe tener al menos 10 caracteres.',
      })
    }

    return { isValid: errors.length === 0, errors }
  }
}

export class FormUIController {
  constructor(form) {
    this.form = form
    this.successEl = document.getElementById('formSuccess')
    this.submitBtn = form.querySelector('button[type="submit"]')
    this.originalBtnContent = this.submitBtn.innerHTML
  }

  showError(field, message) {
    const input = document.getElementById(field)
    const errorEl = document.getElementById(`${field}Error`)
    if (input) input.classList.add('error')
    if (errorEl) errorEl.textContent = message
  }

  clearError(field) {
    const input = document.getElementById(field)
    const errorEl = document.getElementById(`${field}Error`)
    if (input) input.classList.remove('error')
    if (errorEl) errorEl.textContent = ''
  }

  clearAllErrors() {
    ;['name', 'email', 'phone', 'subject', 'message'].forEach((field) => {
      this.clearError(field)
    })
  }

  setLoadingState() {
    this.submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Enviando...'
    this.submitBtn.disabled = true
  }

  resetButton() {
    this.submitBtn.innerHTML = this.originalBtnContent
    this.submitBtn.disabled = false
  }

  showSuccess(
    message = '¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.',
  ) {
    this.successEl.innerHTML = `<i class="fas fa-check-circle"></i><p>${message}</p>`
    this.successEl.style.background = ''
    this.successEl.classList.add('show')
    setTimeout(() => this.successEl.classList.remove('show'), 5000)
  }

  showErrorMessage(message) {
    this.successEl.innerHTML = `<i class="fas fa-exclamation-circle"></i><p>${message}</p>`
    this.successEl.style.background = '#e74c3c'
    this.successEl.style.color = '#e6cecb'
    this.successEl.classList.add('show')
    setTimeout(() => {
      this.successEl.classList.remove('show')
      this.successEl.style.background = ''
    }, 5000)
  }

  resetForm() {
    this.form.reset()
  }
}

export class FormService {
  static async submit(action, formData) {
    const response = await fetch(action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    })
    return { ok: response.ok, data: await response.json().catch(() => ({})) }
  }
}

export class ContactFormController {
  constructor(form) {
    this.form = form
    this.validator = new FormValidator(form)
    this.ui = new FormUIController(form)
    this.init()
  }

  init() {
    this.setupFieldListeners()
    this.form.addEventListener('submit', (e) => this.handleSubmit(e))
  }

  setupFieldListeners() {
    ;['name', 'email', 'phone', 'subject', 'message'].forEach((field) => {
      const input = document.getElementById(field)
      if (input) {
        input.addEventListener('input', () => this.ui.clearError(field))
      }
    })
  }

  async handleSubmit(e) {
    e.preventDefault()
    this.ui.clearAllErrors()

    const { isValid, errors } = this.validator.validate()

    if (!isValid) {
      errors.forEach((err) => this.ui.showError(err.field, err.message))
      return
    }

    this.ui.setLoadingState()

    try {
      const formData = new FormData(this.form)
      const { ok, data } = await FormService.submit(this.form.action, formData)

      this.ui.resetButton()

      if (ok) {
        this.ui.resetForm()
        this.ui.showSuccess()
      } else {
        this.handleServerErrors(data)
      }
    } catch (err) {
      this.ui.resetButton()
      this.ui.showErrorMessage('Error de conexión. Verifique su internet.')
    }
  }

  handleServerErrors(data) {
    if (data?.errors) {
      data.errors.forEach((err) => {
        const field = err.field?.toLowerCase()
        if (field) this.ui.showError(field, err.message)
      })
    }
    this.ui.showErrorMessage('Hubo un error al enviar. Intente nuevamente.')
  }
}
