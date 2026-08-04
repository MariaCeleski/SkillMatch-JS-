
 // MOCKJOBS.JS
 
 // Dados fictícios (mock data) para testes
 // Vagas de exemplo para o simulador
 

// Array de vagas fictícias
const mockJobs = [
    new Job(
        'Tech StartUp XYZ',
        'Front-End Developer Júnior',
        ['HTML', 'CSS', 'JavaScript']
    ),

    new Job(
        'Digital Agency Pro',
        'Junior Web Developer',
        ['JavaScript', 'React', 'CSS']
    ),

    new Job(
        'E-Commerce Company',
        'UI Developer',
        ['HTML', 'CSS', 'JavaScript', 'Responsive Design']
    ),

    new Job(
        'FinTech Solutions',
        'Frontend Developer',
        ['JavaScript', 'React', 'TypeScript', 'REST API']
    ),

    new Job(
        'Creative Studio',
        'Junior Front-End',
        ['HTML', 'CSS']
    )
];

// Dados de exemplo para um candidato
const mockCandidate = new Candidate(
    'Maria de Lourdes Celeski',
    'Front-End',
    ['HTML', 'CSS', 'JavaScript', 'Git'],
    0 // 0 anos de experiência
);

// Exportar dados
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { mockJobs, mockCandidate };
} else if (typeof window !== 'undefined') {
    window.mockData = { mockJobs, mockCandidate };
}