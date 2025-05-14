// Константи для шаблонів градієнтів
export const GRADIENTS = {
  backgroundGradient: 'linear-gradient(135deg, rgba(245, 247, 250, 0.9) 0%, rgba(240, 245, 255, 0.8) 100%)',
  headerGradient: (theme) => `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`,
}; 