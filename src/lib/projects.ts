import { readFileSync, existsSync, readdirSync } from 'fs';
import { join, extname } from 'path';

export interface Parameter {
  type: string;
  description?: string;
  in?: string;
  properties?: Record<string, unknown>;
}

export interface Action {
  label: string;
  description: string;
  method?: string;
  url?: string;
  parameters?: Record<string, Parameter>;
}

// Fonction pour vérifier si un projet existe
export const projectExists = (slug: string): boolean => {
  try {
    const projectPath = join(process.cwd(), 'projects', slug);
    const actionsFilePath = join(projectPath, 'actions.json');
    
    // Vérifier que le dossier du projet existe
    if (!existsSync(projectPath)) {
      return false;
    }
    
    // Vérifier que le fichier actions.json existe
    if (!existsSync(actionsFilePath)) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur lors de la vérification du projet ${slug}:`, error);
    return false;
  }
};

// Fonction pour récupérer le fichier actions.json
export const getActionsFile = (slug: string): Action[] | null => {
  try {
    const filePath = join(process.cwd(), 'projects', slug, 'actions.json');
    const fileContent = readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier actions.json pour ${slug}:`, error);
    return null;
  }
};

// Fonction pour récupérer tous les documents markdown d'un projet
export const getProjectDocs = (slug: string): string[] | null => {
  try {
    const docsPath = join(process.cwd(), 'projects', slug, 'docs');
    
    // Vérifier que le dossier docs existe
    if (!existsSync(docsPath)) {
      return [];
    }
    
    // Lire tous les fichiers du dossier docs
    const files = readdirSync(docsPath);
    const markdownFiles = files.filter(file => extname(file) === '.md');
    
    return markdownFiles;
  } catch (error) {
    console.error(`Erreur lors de la lecture des documents pour ${slug}:`, error);
    return null;
  }
};

// Fonction pour récupérer le contenu textuel d'un fichier markdown
export const getMarkdownContent = (slug: string, filename: string): string | null => {
  try {
    const filePath = join(process.cwd(), 'projects', slug, 'docs', filename);
    
    // Vérifier que le fichier existe
    if (!existsSync(filePath)) {
      console.error(`Le fichier ${filename} n'existe pas dans le projet ${slug}`);
      return null;
    }
    
    // Lire le contenu du fichier
    const content = readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filename} pour ${slug}:`, error);
    return null;
  }
};