import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Project, ProjectArchitecture } from '@/types';

const ARCHITECTURE_DATA: Record<string, ProjectArchitecture> = {
  'Healthcare Intelligence Layer (HIL)': {
    problem: 'Healthcare data is heavily fragmented across isolated hospital silos, handwritten prescriptions, and diagnostic labs, making comprehensive patient history unavailable during urgent consultations.',
    systemDesign: 'A non-invasive middleware intelligence tier that ingests medical records in varying formats, maps clinical entities to standardized JSON schemas, evaluates prospective medications against known interactions and allergy databases, and produces longitudinal health summaries.',
    keyDecisions: [
      'Engineered as an overlay translation layer rather than requiring hospitals to replace existing databases.',
      'Designed modular REST endpoints for ingestion, conflict detection, and summary rendering.',
      'Implemented defensive schema validation on all incoming clinical parameters.',
    ],
    techChoices: [
      { tech: 'FastAPI / Python', reason: 'High throughput asynchronous API handling with native Pydantic schema validation for patient data.' },
      { tech: 'PostgreSQL & JSONB', reason: 'Flexible storage for dynamic diagnostic parameters alongside indexed relational patient records.' },
      { tech: 'AI Clinical Summarization', reason: 'Generates structured bulleted notes highlighting allergies, recent prescriptions, and critical biometric trends.' },
    ],
    lessonsLearned: 'Clinical systems require high reliability and clear audit trails. Even in a 36-hour hackathon, establishing strict data normalization upfront saved hours of downstream integration debugging.',
    codeSnippet: {
      language: 'python',
      filename: 'interaction_checker.py',
      code: `def verify_medication_compatibility(new_drug: str, patient_history: list[dict]) -> list[str]:
    """Inspects prospective prescription against confirmed allergen records and contraindications."""
    warnings = []
    current_prescriptions = [med['name'].lower() for med in patient_history.get('prescriptions', [])]
    allergies = [a.lower() for a in patient_history.get('allergies', [])]

    if new_drug.lower() in allergies:
        warnings.append(f"CRITICAL: Patient has documented allergy to {new_drug}.")

    for active_rx in current_prescriptions:
        conflict = check_contraindication_matrix(new_drug.lower(), active_rx)
        if conflict:
            warnings.append(f"INTERACTION WARNING: {new_drug} clashes with active course of {active_rx}.")

    return warnings`,
    },
  },
  'AI-Based Loan Approval Prediction System': {
    problem: 'Traditional financial loan screening is slow, inconsistent, and often prone to human evaluation bias. Applicants need rapid preliminary clarity, and financial teams need reproducible risk modeling.',
    systemDesign: 'An end-to-end machine learning application that processes applicant financial criteria (income, loan amount, credit score, employment stability), performs exploratory data cleansing and feature scaling, and evaluates approval probabilities across multiple trained classifiers.',
    keyDecisions: [
      'Benchmarked Logistic Regression against non-linear Decision Tree and Random Forest ensembles.',
      'Prioritized F1-score and ROC-AUC over pure accuracy due to class imbalances in loan application acceptance.',
      'Shipped an interactive Streamlit frontend allowing real-time parameter tweaking and immediate probability inspection.',
    ],
    techChoices: [
      { tech: 'Python & Scikit-learn', reason: 'Robust, battle-tested ML primitives for feature pipelines, cross-validation, and classification models.' },
      { tech: 'Pandas & NumPy', reason: 'Vectorized exploratory data analysis, missing-value imputation, and statistical distribution modeling.' },
      { tech: 'Streamlit', reason: 'Rapid interactive visualization interface for evaluating real-time applicant scenarios without heavy web scaffolding.' },
      { tech: 'Matplotlib & Seaborn', reason: 'Generation of confusion matrices, ROC curves, and feature importance bar plots.' },
    ],
    lessonsLearned: 'Model performance on tabular data hinges largely on thoughtful feature engineering and threshold calibration rather than simply selecting a complex algorithm.',
    codeSnippet: {
      language: 'python',
      filename: 'model_evaluation.py',
      code: `from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

def train_and_evaluate_model(X_train, y_train, X_test, y_test):
    # Balanced class weights to handle approval distribution skew
    model = RandomForestClassifier(n_estimators=100, max_depth=6, class_weight='balanced', random_state=42)
    model.fit(X_train, y_train)

    preds = model.predict(X_test)
    probs = model.predict_proba(X_test)[:, 1]

    print("Classification Report:")
    print(classification_report(y_test, preds))
    print(f"ROC-AUC Score: {roc_auc_score(y_test, probs):.4f}")
    return model`,
    },
  },
};

export interface FetchProjectsResult {
  projects: Project[];
  error: string | null;
}

export async function getPublishedProjects(): Promise<FetchProjectsResult> {
  const enrichWithArchitecture = (projectList: Project[]): Project[] => {
    return projectList.map((p) => {
      const arch = ARCHITECTURE_DATA[p.title];
      return {
        ...p,
        architecture: arch || p.architecture,
        domain: p.title.includes('Healthcare') ? 'software' : 'ai',
      };
    });
  };

  if (!isSupabaseConfigured || !supabase) {
    return {
      projects: enrichWithArchitecture([]),
      error: 'Supabase is not configured.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, description, tech_stack, github_url, live_url, is_published, display_order')
      .eq('is_published', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      return {
        projects: [],
        error: error.message || 'Failed to fetch projects from Supabase.',
      };
    }

    const projects = (data as Project[]) || [];
    return {
      projects: enrichWithArchitecture(projects),
      error: null,
    };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'An unexpected error occurred while fetching projects.';
    return {
      projects: [],
      error: message,
    };
  }
}
