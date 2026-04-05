export interface TaskSubtypeOption {
  label: string;
  value: string;
}

export interface TaskNumberCatalogItem {
  number: number;
  title: string;
  subtypes?: TaskSubtypeOption[];
}

export const PART_ONE_TASK_CATALOG: TaskNumberCatalogItem[] = [
  {
    number: 1,
    title: "Планиметрия",
    subtypes: [
      { label: "Решение прямоугольного треугольника", value: "planimetry_right_triangle" },
      { label: "Решение равнобедренного треугольника", value: "planimetry_isosceles_triangle" },
      { label: "Треугольники общего вида", value: "planimetry_general_triangles" },
      { label: "Параллелограммы", value: "planimetry_parallelograms" },
      { label: "Трапеция", value: "planimetry_trapezoid" },
      { label: "Центральные и вписанные углы", value: "planimetry_central_and_inscribed_angles" },
      { label: "Касательная, хорда, секущая", value: "planimetry_tangent_chord_secant" },
      { label: "Вписанные окружности", value: "planimetry_inscribed_circles" },
      { label: "Описанные окружности", value: "planimetry_circumscribed_circles" },
    ],
  },
  {
    number: 2,
    title: "Векторы",
    subtypes: [
      { label: "Длина вектора после операций", value: "vectors_length_after_operations" },
      { label: "Угол между векторами", value: "vectors_angle_between" },
      { label: "Скалярное произведение", value: "vectors_dot_product" },
    ],
  },
  {
    number: 3,
    title: "Стереометрия",
    subtypes: [
      { label: "Куб (15 шт.)", value: "stereometry_cube" },
      { label: "Прямоугольный параллелепипед", value: "stereometry_rectangular_prism" },
      { label: "Элементы составных многогранников", value: "stereometry_composite_polyhedra_elements" },
      { label: "Площадь поверхности составного многогранника", value: "stereometry_composite_polyhedra_surface_area" },
      { label: "Объем составного многогранника", value: "stereometry_composite_polyhedra_volume" },
      { label: "Призма", value: "stereometry_prism" },
      { label: "Пирамида", value: "stereometry_pyramid" },
      { label: "Комбинации тел", value: "stereometry_combined_solids" },
      { label: "Цилиндр", value: "stereometry_cylinder" },
      { label: "Конус", value: "stereometry_cone" },
      { label: "Шар", value: "stereometry_sphere" },
    ],
  },
  { number: 4, title: "Классическая теория вероятностей" },
  { number: 5, title: "Сложная вероятность" },
  {
    number: 6,
    title: "Простейшие уравнения",
    subtypes: [
      { label: "Линейные, квадратные, кубические уравнения", value: "basic_equations_linear_quadratic_cubic" },
      { label: "Рациональные уравнения", value: "basic_equations_rational" },
      { label: "Иррациональные уравнения", value: "basic_equations_irrational" },
      { label: "Показательные уравнения", value: "basic_equations_exponential" },
      { label: "Логарифмические уравнения", value: "basic_equations_logarithmic" },
      { label: "Тригонометрические уравнения", value: "basic_equations_trigonometric" },
    ],
  },
  {
    number: 7,
    title: "Вычисления и преобразования",
    subtypes: [
      { label: "Тригонометрия", value: "transformations_trigonometry" },
      { label: "Логарифмы", value: "transformations_logarithms" },
      { label: "Степени", value: "transformations_powers" },
      { label: "Дроби", value: "transformations_fractions" },
      { label: "Иррациональные выражения", value: "transformations_irrational_expressions" },
    ],
  },
  { number: 8, title: "Производная" },
  {
    number: 9,
    title: "Прикладные задачи",
    subtypes: [
      { label: "Линейные уравнения и неравенства", value: "applied_linear_equations_inequalities" },
      { label: "Квадратные и степенные уравнения и неравенства", value: "applied_quadratic_power_equations_inequalities" },
      { label: "Рациональные уравнения и неравенства", value: "applied_rational_equations_inequalities" },
      { label: "Иррациональные уравнения и неравенства", value: "applied_irrational_equations_inequalities" },
      { label: "Показательные уравнения и неравенства", value: "applied_exponential_equations_inequalities" },
      { label: "Логарифмические уравнения и неравенства", value: "applied_logarithmic_equations_inequalities" },
      { label: "Тригонометрические уравнения и неравенства", value: "applied_trigonometric_equations_inequalities" },
      { label: "Разные задачи", value: "applied_mixed" },
    ],
  },
  {
    number: 10,
    title: "Текстовые задачи",
    subtypes: [
      { label: "Движение", value: "word_problems_motion" },
      { label: "Движение по воде", value: "word_problems_water_motion" },
      { label: "Проценты, сплавы, смеси", value: "word_problems_percent_alloys_mixtures" },
      { label: "Работа и производительность", value: "word_problems_work_productivity" },
    ],
  },
  {
    number: 11,
    title: "Графики функций",
    subtypes: [
      { label: "Линейные функции", value: "function_graphs_linear" },
      { label: "Параболы", value: "function_graphs_parabolas" },
      { label: "Гиперболы", value: "function_graphs_hyperbolas" },
      { label: "Корни", value: "function_graphs_roots" },
      { label: "Показательные и логарифмические функции", value: "function_graphs_exponential_logarithmic" },
      { label: "Тригонометрические функции", value: "function_graphs_trigonometric" },
      { label: "Смешанное", value: "function_graphs_mixed" },
    ],
  },
  {
    number: 12,
    title: "Исследование функций",
    subtypes: [
      { label: "Тригонометрические функции", value: "function_analysis_trigonometric" },
      { label: "Логарифмические функции", value: "function_analysis_logarithmic" },
      { label: "Показательные функции", value: "function_analysis_exponential" },
      { label: "Смешанное", value: "function_analysis_mixed" },
    ],
  },
];

export const DEFAULT_TASK_NUMBER = PART_ONE_TASK_CATALOG[0];

export const getCatalogItemByNumber = (number: number): TaskNumberCatalogItem =>
  PART_ONE_TASK_CATALOG.find((item) => item.number === number) ?? DEFAULT_TASK_NUMBER;

export const getDefaultTypeForNumber = (number: number) => {
  const item = getCatalogItemByNumber(number);
  return item.subtypes?.[0]?.value ?? `task_${item.number}_${item.title.toLowerCase().replace(/\s+/g, "_")}`;
};
