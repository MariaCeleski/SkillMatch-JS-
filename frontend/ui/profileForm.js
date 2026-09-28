/** Mostra uma mensagem associada ao campo inválido. */
function showFormError(field, errorId, message) {
 const error = document.getElementById(errorId);
 field.setAttribute('aria-invalid', 'true');
 if (!error) return;
 error.textContent = message;
 error.hidden = false;
}

/** Restaura o estado de validação antes de cada nova tentativa de envio. */
function clearFormErrors() {
 document.querySelectorAll('#candidateForm [aria-invalid]').forEach(field => {
 field.setAttribute('aria-invalid', 'false');
 });
 document.querySelectorAll('#candidateForm .form-error').forEach(error => {
 error.textContent = '';
 error.hidden = true;
 });
}

/** Lê e valida os dados do formulário de perfil. */
export function getProfileFormData() {
 const nameInput = document.getElementById('candidateName');
 const areaInput = document.getElementById('areaOfInterest');
 const name = nameInput.value.trim();
 const area = areaInput.value.trim();
 const experience = parseInt(document.getElementById('experience').value) || 0;
 const skills = Array.from(document.querySelectorAll('input[name="skills"]:checked'), checkbox => checkbox.value);

 clearFormErrors();
 let firstInvalidField = null;

 if (!name) {
 showFormError(nameInput, 'candidateNameError', 'Informe seu nome.');
 firstInvalidField = nameInput;
 }
 if (!area) {
 showFormError(areaInput, 'areaOfInterestError', 'Selecione sua área de interesse.');
 firstInvalidField = firstInvalidField || areaInput;
 }
 if (skills.length === 0) {
 const skillsGroup = document.getElementById('skillsGroup');
 const firstSkill = document.querySelector('input[name="skills"]');
 const skillsError = document.getElementById('skillsError');
 if (skillsGroup) skillsGroup.setAttribute('aria-invalid', 'true');
 skillsError.textContent = 'Selecione ao menos uma habilidade.';
 skillsError.hidden = false;
 firstInvalidField = firstInvalidField || firstSkill;
 }

 if (firstInvalidField) {
 firstInvalidField.focus();
 return null;
 }

 return { name, area, experience, skills };
}

/** Preenche o formulário com dados de um perfil salvo. */
export function restoreProfileForm(savedProfile) {
 if (!savedProfile) return;

 document.getElementById('candidateName').value = savedProfile.name;
 document.getElementById('areaOfInterest').value = savedProfile.areaOfInterest;
 document.getElementById('experience').value = savedProfile.yearsOfExperience;
 document.getElementById('experienceSlider').value = savedProfile.yearsOfExperience;
 document.getElementById('experienceDisplay').textContent = `${savedProfile.yearsOfExperience} ano${savedProfile.yearsOfExperience !== 1 ? 's' : ''}`;

 document.querySelectorAll('input[name="skills"]').forEach(checkbox => {
 checkbox.checked = savedProfile.skills.includes(checkbox.value);
 });
}
