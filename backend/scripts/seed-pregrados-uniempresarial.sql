BEGIN;

UPDATE programs
SET name = 'Finanzas y Comercio Exterior'
WHERE lower(name) = 'finanzas'
  AND NOT EXISTS (SELECT 1 FROM programs WHERE lower(name) = 'finanzas y comercio exterior');

INSERT INTO programs(name)
SELECT p.name
FROM (VALUES
  ('Ingeniería de Software'),
  ('Administración de Empresas'),
  ('Marketing'),
  ('Negocios Internacionales'),
  ('Finanzas y Comercio Exterior')
) AS p(name)
WHERE NOT EXISTS (SELECT 1 FROM programs existing WHERE lower(existing.name) = lower(p.name));

WITH curriculum(program, subject) AS (VALUES
  ('Ingeniería de Software','Álgebra y Programación Lineal'),
  ('Ingeniería de Software','Cálculo I'),
  ('Ingeniería de Software','Cálculo II'),
  ('Ingeniería de Software','Cálculo III'),
  ('Ingeniería de Software','Física'),
  ('Ingeniería de Software','Introducción a la Programación'),
  ('Ingeniería de Software','Lenguajes de Programación'),
  ('Ingeniería de Software','Infraestructura TI y Cloud Computing'),
  ('Ingeniería de Software','Fundamentos de Ingeniería de Software y Programación'),
  ('Ingeniería de Software','Desarrollo Frontend'),
  ('Ingeniería de Software','Probabilidad, Estadística y Métodos Numéricos'),
  ('Ingeniería de Software','Arquitectura de Software'),
  ('Ingeniería de Software','Big Data y Analítica'),
  ('Ingeniería de Software','Desarrollo Full Stack'),
  ('Ingeniería de Software','Diseño y Desarrollo de Videojuegos'),
  ('Ingeniería de Software','Aplicaciones Móviles'),
  ('Ingeniería de Software','Métricas de Calidad de Software'),
  ('Ingeniería de Software','Gerencia de Proyectos'),
  ('Ingeniería de Software','Inteligencia Artificial'),
  ('Administración de Empresas','Fundamentos de Administración'),
  ('Administración de Empresas','Proceso Administrativo'),
  ('Administración de Empresas','Direccionamiento Estratégico'),
  ('Administración de Empresas','Digital Transformation'),
  ('Administración de Empresas','Formulación y Evaluación de Proyectos'),
  ('Administración de Empresas','Dirección y Gestión de Proyectos'),
  ('Administración de Empresas','Capital Humano'),
  ('Administración de Empresas','Marketing y Cadena de Suministro'),
  ('Administración de Empresas','Finanzas'),
  ('Administración de Empresas','Gestión de la Innovación'),
  ('Administración de Empresas','ERP & Database Management'),
  ('Administración de Empresas','Analytics & Artificial Intelligence'),
  ('Administración de Empresas','Valoración de Empresas'),
  ('Marketing','Fundamentos de Marketing'),
  ('Marketing','Green Marketing y Valor Compartido'),
  ('Marketing','Investigación de Mercados y Estudio del Consumidor'),
  ('Marketing','Estrategia de Producto y Precio'),
  ('Marketing','Marketing Channels'),
  ('Marketing','Marketing Digital'),
  ('Marketing','Marketing Internacional'),
  ('Marketing','Producción y Cadena de Suministro'),
  ('Marketing','Gestión de la Innovación'),
  ('Marketing','Producción y Planeación de la Producción'),
  ('Marketing','CIM'),
  ('Marketing','Gerencia Estratégica de Mercadeo'),
  ('Marketing','ERP & Database Management'),
  ('Marketing','Analytics & Artificial Intelligence'),
  ('Negocios Internacionales','Fundamentos de Negocios Internacionales'),
  ('Negocios Internacionales','Política Comercial y Acuerdos Internacionales'),
  ('Negocios Internacionales','Logística y DFI'),
  ('Negocios Internacionales','Geopolítica y Relaciones Internacionales'),
  ('Negocios Internacionales','Estudio de Área Europa y Estados Unidos'),
  ('Negocios Internacionales','Estudio de Área América Latina y Asia'),
  ('Negocios Internacionales','International Legislation and Sanctioning Regime'),
  ('Negocios Internacionales','Negotiation Techniques and Conflict Resolution'),
  ('Negocios Internacionales','International Business Management'),
  ('Negocios Internacionales','Importaciones y Exportaciones'),
  ('Negocios Internacionales','Globalización y Orden Mundial'),
  ('Negocios Internacionales','Planeación Estratégica Internacional'),
  ('Finanzas y Comercio Exterior','Fundamentos de Comercio Exterior'),
  ('Finanzas y Comercio Exterior','Análisis Microeconómico'),
  ('Finanzas y Comercio Exterior','Análisis Macroeconómico'),
  ('Finanzas y Comercio Exterior','Matemática Financiera'),
  ('Finanzas y Comercio Exterior','Contabilidad Financiera'),
  ('Finanzas y Comercio Exterior','Financial Reporting and Management'),
  ('Finanzas y Comercio Exterior','International Corporate Finance'),
  ('Finanzas y Comercio Exterior','Legislación Comercial y Tributaria'),
  ('Finanzas y Comercio Exterior','Legislación Laboral'),
  ('Finanzas y Comercio Exterior','Régimen Sancionatorio y Aduanero'),
  ('Finanzas y Comercio Exterior','Política Comercial y Acuerdos Internacionales'),
  ('Finanzas y Comercio Exterior','Aranceles'),
  ('Finanzas y Comercio Exterior','Importaciones y Exportaciones'),
  ('Finanzas y Comercio Exterior','Bolsa y Portafolio'),
  ('Finanzas y Comercio Exterior','Gestión de la Cadena de Abastecimiento'),
  ('Finanzas y Comercio Exterior','Internationalization Strategies'),
  ('Ingeniería de Software','Herramientas de Diagnóstico Empresarial'),
  ('Administración de Empresas','Herramientas de Diagnóstico Empresarial'),
  ('Marketing','Herramientas de Diagnóstico Empresarial'),
  ('Negocios Internacionales','Herramientas de Diagnóstico Empresarial'),
  ('Finanzas y Comercio Exterior','Herramientas de Diagnóstico Empresarial'),
  ('Ingeniería de Software','Cátedra Uniempresarial'),
  ('Administración de Empresas','Cátedra Uniempresarial'),
  ('Marketing','Cátedra Uniempresarial'),
  ('Negocios Internacionales','Cátedra Uniempresarial'),
  ('Finanzas y Comercio Exterior','Cátedra Uniempresarial'),
  ('Ingeniería de Software','Entorno Colombiano'),
  ('Administración de Empresas','Entorno Colombiano'),
  ('Marketing','Entorno Colombiano'),
  ('Negocios Internacionales','Entorno Colombiano'),
  ('Finanzas y Comercio Exterior','Entorno Colombiano'),
  ('Ingeniería de Software','Fundamentos Estadísticos para el Entorno Empresarial'),
  ('Administración de Empresas','Fundamentos Estadísticos para el Entorno Empresarial'),
  ('Marketing','Fundamentos Estadísticos para el Entorno Empresarial'),
  ('Negocios Internacionales','Fundamentos Estadísticos para el Entorno Empresarial'),
  ('Finanzas y Comercio Exterior','Fundamentos Estadísticos para el Entorno Empresarial'),
  ('Ingeniería de Software','English Beginners'),
  ('Administración de Empresas','English Beginners'),
  ('Marketing','English Beginners'),
  ('Negocios Internacionales','English Beginners'),
  ('Finanzas y Comercio Exterior','English Beginners'),
  ('Ingeniería de Software','Creatividad y Prospectiva Emprendedora'),
  ('Administración de Empresas','Creatividad y Prospectiva Emprendedora'),
  ('Marketing','Creatividad y Prospectiva Emprendedora'),
  ('Negocios Internacionales','Creatividad y Prospectiva Emprendedora'),
  ('Finanzas y Comercio Exterior','Creatividad y Prospectiva Emprendedora'),
  ('Ingeniería de Software','Ética y Responsabilidad Social Empresarial'),
  ('Administración de Empresas','Ética y Responsabilidad Social Empresarial'),
  ('Marketing','Ética y Responsabilidad Social Empresarial'),
  ('Negocios Internacionales','Ética y Responsabilidad Social Empresarial'),
  ('Finanzas y Comercio Exterior','Ética y Responsabilidad Social Empresarial'),
  ('Ingeniería de Software','Métodos de Obtención y Análisis de Observación Empresarial'),
  ('Administración de Empresas','Métodos de Obtención y Análisis de Observación Empresarial'),
  ('Marketing','Métodos de Obtención y Análisis de Observación Empresarial'),
  ('Negocios Internacionales','Métodos de Obtención y Análisis de Observación Empresarial'),
  ('Finanzas y Comercio Exterior','Métodos de Obtención y Análisis de Observación Empresarial'),
  ('Ingeniería de Software','Basic English'),
  ('Administración de Empresas','Basic English'),
  ('Marketing','Basic English'),
  ('Negocios Internacionales','Basic English'),
  ('Finanzas y Comercio Exterior','Basic English'),
  ('Ingeniería de Software','Elementary English'),
  ('Administración de Empresas','Elementary English'),
  ('Marketing','Elementary English'),
  ('Negocios Internacionales','Elementary English'),
  ('Finanzas y Comercio Exterior','Elementary English'),
  ('Ingeniería de Software','Innovación'),
  ('Administración de Empresas','Innovación'),
  ('Marketing','Innovación'),
  ('Negocios Internacionales','Innovación'),
  ('Finanzas y Comercio Exterior','Innovación'),
  ('Ingeniería de Software','Preintermediate English'),
  ('Administración de Empresas','Preintermediate English'),
  ('Marketing','Preintermediate English'),
  ('Negocios Internacionales','Preintermediate English'),
  ('Finanzas y Comercio Exterior','Preintermediate English'),
  ('Ingeniería de Software','Electiva Libre'),
  ('Administración de Empresas','Electiva Libre'),
  ('Marketing','Electiva Libre'),
  ('Negocios Internacionales','Electiva Libre'),
  ('Finanzas y Comercio Exterior','Electiva Libre'),
  ('Ingeniería de Software','Electiva de Profundización 1'),
  ('Administración de Empresas','Electiva de Profundización 1'),
  ('Marketing','Electiva de Profundización 1'),
  ('Negocios Internacionales','Electiva de Profundización 1'),
  ('Finanzas y Comercio Exterior','Electiva de Profundización 1'),
  ('Ingeniería de Software','Electiva de Profundización 2'),
  ('Administración de Empresas','Electiva de Profundización 2'),
  ('Marketing','Electiva de Profundización 2'),
  ('Negocios Internacionales','Electiva de Profundización 2'),
  ('Finanzas y Comercio Exterior','Electiva de Profundización 2')
), new_subjects AS (
  INSERT INTO subjects(name_subjects,status_subjects)
  SELECT DISTINCT subject, 1 FROM curriculum c
  WHERE NOT EXISTS (SELECT 1 FROM subjects s WHERE lower(s.name_subjects)=lower(c.subject))
  RETURNING id_subjects
)
INSERT INTO programs_subjects(id_programs,id_subjects,status_programs_subject)
SELECT p.id,s.id_subjects,1
FROM curriculum c
JOIN programs p ON lower(p.name)=lower(c.program)
JOIN subjects s ON lower(s.name_subjects)=lower(c.subject)
WHERE NOT EXISTS (
  SELECT 1 FROM programs_subjects ps
  WHERE ps.id_programs=p.id AND ps.id_subjects=s.id_subjects
);

INSERT INTO promotions(name_promotion,id_programs,status_promotions)
SELECT n2.suffix || chr(n2.letter), p.id, 1
FROM programs p
CROSS JOIN generate_series(10,20) AS n(number)
CROSS JOIN (VALUES (65),(66)) AS letters(letter)
CROSS JOIN LATERAL (SELECT n.number::text AS suffix, letters.letter) AS n2
WHERE p.name IN ('Ingeniería de Software','Administración de Empresas','Marketing','Negocios Internacionales','Finanzas y Comercio Exterior')
  AND NOT EXISTS (
    SELECT 1 FROM promotions existing
    WHERE existing.id_programs=p.id AND existing.name_promotion=n2.suffix || chr(n2.letter)
  );

COMMIT;
