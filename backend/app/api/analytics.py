from fastapi import APIRouter, Depends
from app.analytics.analytics_service import AnalyticsService

router = APIRouter()

analytics_service_instance = AnalyticsService()

def get_analytics_service():
    return analytics_service_instance

@router.get("/categories")
def get_category_trends(service: AnalyticsService = Depends(get_analytics_service)):
    return service.get_category_trends()

@router.get("/publications")
def get_publication_trends(service: AnalyticsService = Depends(get_analytics_service)):
    return service.get_publication_trends()

from app.analytics.advanced_service import AdvancedAnalyticsService

advanced_analytics_service_instance = AdvancedAnalyticsService()

def get_advanced_analytics_service():
    return advanced_analytics_service_instance

@router.get("/advanced/authors")
def get_author_metrics(service: AdvancedAnalyticsService = Depends(get_advanced_analytics_service)):
    return service.get_author_metrics()

@router.get("/advanced/network")
def get_citation_network(service: AdvancedAnalyticsService = Depends(get_advanced_analytics_service)):
    return service.get_citation_network()

